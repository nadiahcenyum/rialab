    <?php
        include('facebook-php-sdk/src/facebook.php');

        $facebook = new Facebook(array(
          'appId'  => '192415810884740',
          'secret' => '2c4fbe0f02ed7c30cc948864ddc8031d',
          'fileUpload' => true,
        ));

        // Get User ID
        $user_id = $facebook->getUser();
        // Get the current access token

        echo "User id: " . $user_id . "<br/>";
        echo "Access token: " . $access_token;

        if (isset($GLOBALS["HTTP_RAW_POST_DATA"]))
         {
             // Get the data
             $imageData=$GLOBALS['HTTP_RAW_POST_DATA'];
             // Remove the headers (data:,) part.
             // A real application should use them according to needs such as to check image type
             $filteredData=substr($imageData, strpos($imageData, ",")+1);
             // Need to decode before saving since the data we received is already base64 encoded
             $unencodedData=base64_decode($filteredData);
             //echo "unencodedData".$unencodedData;
             // Save file.  This example uses a hard coded filename for testing,
             // but a real application can specify filename in POST variable
             $fp = fopen( 'uploadimages/drawing.png', 'wb' );
             fwrite( $fp, $unencodedData);
             fclose( $fp );
         }
        //image file upload logic below
        $target_path = "uploadimages/drawing.png";

        //get the mesaage
        $msg = "This is my latest painting in the Canvas Paint App. Check this out! Test$$$$$";//$_REQUEST["message"];

        //echo $target_path . basename( $_FILES['uploadedfile']['name']);
        //$target_path = $target_path . basename( $_FILES['uploadedfile']['name']);

        /*if(move_uploaded_file($_FILES['uploadedfile']['tmp_name'], $target_path)) {
            echo "The file ".  basename( $_FILES['uploadedfile']['name']).
            " has been uploaded";
        } else{
            echo "There was an error uploading the file, please try again!";
        } */

        if($user_id) {

          // We have a user ID, so probably a logged in user.
          // If not, we'll get an exception, which we handle below.
          try {
            $access_token = $facebook->getAccessToken();
            // Upload to a user's profile. The photo will be in the
            // first album in the profile. You can also upload to
            // a specific album by using /ALBUM_ID as the path
            $ret_obj = $facebook->api('/me/photos', 'POST', array(
                                             'source' => '@' . $target_path,
                                             'message' => $msg,
                                             'access_token'  => $access_token,
                                             )
                                          );
            echo '<pre>Photo ID: ' . $ret_obj['id'] . '</pre>';

          } catch(FacebookApiException $e) {
            // If the user is logged out, you can have a
            // user ID even though the access token is invalid.
            // In this case, we'll get an exception, so we'll
            // just ask the user to login again here.
            $user_id = null;
            $login_url = $facebook->getLoginUrl( array(
                           'scope' => 'photo_upload'
                           ));
            echo 'Please <a href="' . $login_url . '">login.</a>';

            echo $e->getType() . "<br/>";
            echo $e->getMessage();
            //error_log($e->getType());
            //error_log($e->getMessage());
          }
          $params = array (
                'access_token' => ''.$access_token.'',
            );
          echo '<br /><a href="' . $facebook->getLogoutUrl($params) . '">logout</a>';
        } else {

          // No user, print a link for the user to login
          // To upload a photo to a user's wall, we need photo_upload  permission
          // We'll use the current URL as the redirect_uri, so we don't
          // need to specify it here.
          $login_url = $facebook->getLoginUrl( array( 'scope' => 'photo_upload') );
          echo 'Please <a href="' . $login_url . '">login.</a>';

        }

    ?>