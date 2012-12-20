    <?php
        include('facebook-php-sdk/src/facebook.php');

        $facebook = new Facebook(array(
          'appId'  => '430939990293947',  //Pacifico App
          'secret' => 'b270e5d253268d75c4d4f9580d9127cd',
          'fileUpload' => true,
          'cookie' => true
        ));

        $access_token = $_POST['token'];    //get access token

        $msg = $_POST['msg'];   //now getting the message from CanvasPaint Android App. This is implemented in testing.gold.com/canvaspaintapp/uploadandpost.php only

        $imageData = $_REQUEST['data'];   //get base64 image data as string
        $image = explode('base64,',$imageData);
        $target_path = 'uploadimages/' . md5(date('Ymdgisu')) . '.png';
        file_put_contents($target_path, base64_decode($image[1])); //write the file to the location under $target_path

        //echo $target_path;

          try {
            // Upload to a user's profile. The photo will be in the
            // first album in the profile. You can also upload to
            // a specific album by using /ALBUM_ID as the path
            $ret_obj = $facebook->api('/me/photos', 'POST', array(
                                             'source' => '@' . $target_path,
                                             'message' => $msg,
                                             'access_token'  => $access_token,
                                             )
                                          );
            //echo 'photo_id: ' . $ret_obj['id'];      //return the image path for email to read in the app
            echo 'path:' . $target_path;

          } catch(FacebookApiException $e) {
            // If the user is logged out, you can have a
            // user ID even though the access token is invalid.
            // In this case, we'll get an exception, so we'll
            // just ask the user to login again here.
            echo "error type: " . $e->getType() . " Error message: " . $e->getMessage();
            //echo "=" . &target_path; //pass the image path anyways
            //error_log($e->getType());
            //error_log($e->getMessage());
          }
    ?>