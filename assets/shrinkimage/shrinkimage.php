<?php
date_default_timezone_set('Europe/Berlin');
$base = dirname(__FILE__);

if(isset($_GET['file']) && !empty($_GET['file']) && isset($_GET['source']) && !empty($_GET['source'])) {
	$jsonp    = (isset($_GET['jsonp']) && !empty($_GET['jsonp'])) ? true : false;
	$callback = isset($_GET['callback']) && !empty($_GET['callback']) ? $_GET['callback'] : NULL;
	$quality  = (isset($_GET['quality']) && !empty($_GET['quality'])) ? (int) $_GET['quality'] : 80;

	if($jsonp === true && $callback === NULL) {
		throw new Exception('shrinkimage: Callback must be defined');
	}

	$targetJson = $base . '/' . $_GET['file'];
	$targetPath = dirname($targetJson);

	if(!is_file($targetJson)) {
		$json = NULL;

		$sourceFile = $base . '/' . $_GET['source'];
		$sourceName = basename($_GET['source']);

		if(is_file($sourceFile)) {
			if(!is_dir($targetPath)) {
				createDirectory($targetPath);
			}

			$colorCache = array(127 => rgb2color(0, 0, 0, 0));

			$size   = @getimagesize($sourceFile);
			$width  = $size[0];
			$height = $size[1];

			$imageSource = @imagecreatefrompng($sourceFile);
			$imageJpg    = @imagecreatetruecolor($width, $height);
			$imagePng    = @imagecreatetruecolor($width, $height);

			if(@imageistruecolor($imageSource) === false) {
				$imageTemp = @imagecreatetruecolor($width, $height);

				@imagecopy($imageTemp, $imageSource, 0, 0, 0, 0, $width, $height);
				@imagedestroy($imageSource);

				$imageSource = $imageTemp;
			}

			@imagealphablending($imageSource, false);
			@imagesavealpha($imageSource, true);
			@imagealphablending($imagePng, false);
			@imagesavealpha($imagePng, true);

			@imagefill($imageJpg, 0, 0, rgb2color(127, 127, 127));
			@imagefill($imagePng, 0, 0, $colorCache[127]);

			for($x = 0; $x < $width; $x++) {
				for($y = 0; $y < $height; $y++) {
					$color = color2rgb(imagecolorat($imageSource, $x, $y));

					if($color['a'] < 127) {
						imagesetpixel($imageJpg, $x, $y, rgb2color($color['r'], $color['g'], $color['b']));

						if(!isset($colorCache[$color['a']])) {
							$colorCache[$color['a']] = rgb2color(0, 0, 0, 127 - $color['a']);
						}

						imagesetpixel($imagePng, $x, $y, $colorCache[$color['a']]);
					}
				}
			}

			$imageJpg = getImage($imageJpg, 'jpeg', true, $quality);
			$imagePng = getImage($imagePng, 'png', false, 9, PNG_ALL_FILTERS);

			$json         = new stdClass();
			$json->size   = @filesize($sourceFile);
			$json->width  = $width;
			$json->height = $height;
			$json->main   = 'data:image/jpeg;base64,' . base64_encode($imageJpg);
			$json->alpha  = 'data:image/png;base64,' . base64_encode($imagePng);

			$json = json_encode($json);

			@file_put_contents($targetJson, $json, LOCK_EX);
		} else {
			throw new Exception('shrinkimage: Source file "' . $_GET['source'] . '" does not exist');
		}

		$etag = md5_file($targetJson);

		header('ETag: ' . $etag, true);
		header('Last-Modified: ' . gmdate('D, d M Y H:i:s', @filemtime($targetJson)) . ' GMT', true, 200);
		header('Vary: Accept, Cache-Control', true);
		header('Cache-control: public, must-revalidate, proxy-revalidate', true);

		switch($jsonp) {
			case true:
				$json = $callback . '(' . $json . ');';
				header('Content-Length: ' . strlen($json));
				header('Content-type: application/javascript');
				echo $json;
				die();
				break;
			default:
				header('Content-Length: ' . strlen($json));
				header('Content-type: application/json');
				echo $json;
				die();
				break;
		}
	} else {
		$headers  = apache_request_headers();
		$modified = @filemtime($targetJson);
		$etag     = md5_file($targetJson);

		if(isset($_SERVER['HTTP_IF_NONE_MATCH']) && $_SERVER['HTTP_IF_NONE_MATCH'] === $etag) {
			header('HTTP/1.1 304 Not Modified', true);
			die();
		}

		if(isset($headers['HTTP_IF_MODIFIED_SINCE']) && (strtotime($headers['HTTP_IF_MODIFIED_SINCE']) >= $modified)) {
			header('HTTP/1.1 304 Not Modified', true);
			die();
		}

		$json = file_get_contents($targetJson);

		header('ETag: ' . $etag, true);
		header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $modified) . ' GMT', true, 200);
		header('Vary: Accept, Cache-Control', true);
		header('Cache-control: public, must-revalidate, proxy-revalidate', true);

		switch($jsonp) {
			case true:
				$json = $callback . '(' . $json . ');';
				header('Content-Length: ' . strlen($json));
				header('Content-type: application/javascript');
				echo $json;
				die();
				break;
			default:
				header('Content-Length: ' . strlen($json));
				header('Content-type: application/json');
				echo $json;
				die();
				break;
		}
	}
}

function rgb2color($r, $g, $b, $a = 0) {
	return ($r << 16) + ($g << 8) + $b + ($a << 24);
}

function color2rgb($color) {
	$return = null;

	if(preg_match('/^\d+$/', $color)) {
		$return = array(
			'r' => ($color >> 16) & 0xFF,
			'g' => ($color >> 8) & 0xFF,
			'b' => $color & 0xFF,
			'a' => ($color & 0x7F000000) >> 24,
		);
	}

	return $return;
}

function getImage($resource, $type = 'png', $interlace = false, $quality = NULL, $filter = 248) {
	if($interlace === true) {
		@imageinterlace($resource, 1);
	}

	ob_start();

	switch($type) {
		case 'png':
			$quality = ($quality === NULL) ? 9 : max(0, min(9, (int) $quality));

			@imagepng($resource, NULL, $quality, $filter);
			break;
		case 'jpeg':
			$quality = ($quality === NULL) ? 100 : max(0, min(100, (int) $quality));

			@imagejpeg($resource, NULL, $quality);
			break;
	}

	return trim(ob_get_clean());
}

function createDirectory($directory) {
	$return = false;

	try {
		$return = @mkdir($directory, 0750, true);
	} catch(Exception $exception) {
		throw new Exception('shrinkimage: Error creating directory "' . $directory . '"');
	}

	return $return;
}

die();
?>