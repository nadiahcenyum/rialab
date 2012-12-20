     <?php
     /*include('facebook-php-sdk/src/facebook.php');
     $facebook = new Facebook(array(
       'appId'  => '192415810884740',
       'secret' => '2c4fbe0f02ed7c30cc948864ddc8031d',
       'fileUpload' => true,
       'cookie' => true
     ));  */

     if (isset($GLOBALS["HTTP_RAW_POST_DATA"]))
     {
	     // Get the data
         $passedData= $GLOBALS['HTTP_RAW_POST_DATA'];
         // Remove the headers (data:,) part.
         // A real application should use them according to needs such as to check image type
         $filteredData=substr($passedData, strpos($passedData, ",")+1);
         //echo $filteredData;
         //$param2 = substr($passedData, strpos($passedData, "&") + 1);    //get the second parameter - the access token
         //echo $param2;
         //filter piut the actual base 64 image string
         //$imageData = substr($filteredData, 0, (strlen($filteredData) - (strlen($param2) + 1)));
         //echo $imageData;
         // Need to decode before saving since the data we received is already base64 encoded
         $unencodedData=base64_decode($filteredData);
         //$token = base64_decode($param2);
         //echo $token;
         // Save file.  This example uses a hard coded filename for testing,
         // but a real application can specify filename in POST variable
	     $file = 'uploadimages/' . md5(date('Ymdgisu')) . '.png';
	     //echo $file;
         $fp = fopen( $file, 'wb' );
         fwrite( $fp, $unencodedData);
         fclose( $fp );	 
         echo $file;

         //get the mesaage
         /*$msg = "This is my latest painting in the Canvas Paint App. Check this out! JTest######";//$_REQUEST["message"];
         $user = $facebook->getUser();
         if($user)
         {
             try {
                 $access_token = $facebook->getAccessToken();
                 // Upload to a user's profile. The photo will be in the
                 // first album in the profile. You can also upload to
                 // a specific album by using /ALBUM_ID as the path
                 //$facebook->setFileUploadSupport(true);
                 $ret_obj = $facebook->api('/me/photos', 'POST', array(
                                                  'source' => '@' . $file,
                                                  'message' => $msg,
                                                  'access_token'  => $access_token,
                                                  )
                                               );
                 echo 'Photo uploaded ID: ' . $ret_obj['id'];

           } catch(FacebookApiException $e) {
                 echo $e->getType() . "<br/>";
                 echo $e->getMessage();
           }
       } */
     }
     else{
         echo 'Something went wrong!';
     }
     ?>
