import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

 cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
         try {
                // console.log(localFilePath);
                if(!localFilePath) return null
                //upload the file on cloudinary
                const response = await cloudinary.uploader.upload(localFilePath, {
                        resource_type: "auto"
                })
                // file has been uploaded successfull
                
                // console.log("file is uploaded on cloudinary", response.url);
                fs.unlinkSync(localFilePath)
                // console.log("response", response);
                return response

        } catch (error) {
                
                fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload opertion got failed
                return null;
        }
}

const deleteImageOnCloudinary = async (imageUrl) => {
        try {
                // console.log("ImageUrl", imageUrl);
                if(!imageUrl) return null;
                
                // Splits the URL by '/upload/'
                const parts = imageUrl.split('/upload/');
                if (parts.length < 2) return null;
                
                // Removes the version number (e.g., 'v12345678/') if it exists, and removes the file extension
                const publicIdWithExtension = parts[1].replace(/^v\d+\//, '');

                
                const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.')); 
                // console.log("publicId", publicId);

                if(!publicId) return null

                const response = await cloudinary.uploader.destroy(publicId, { invalidate: true })
                
                return response;

        } catch (error) {
                return null
        }
}

export {
        uploadOnCloudinary, deleteImageOnCloudinary
}