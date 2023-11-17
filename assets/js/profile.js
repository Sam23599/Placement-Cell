try {
    //---------On Form Submit---------
    const file = document.querySelector("input.image");
    const submit = document.querySelector(".submit-btn");
    const form = document.querySelector("form");
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    submit.addEventListener("click", (e) => {
        
        //If name/email/password is empty
        if (name === "" || email === "" || password === "") return;

        if (file.files.length > 0) {
            //FRONTEND VALIDATION :: File Size must be less than equal to 3MB
            if (file.files[0].size > 1024 * 1024 * 3) {

                return;
            }
            //FRONTEND VALIDATION :: File must be an Image
            if (
                file.files[0].type !== "image/jpeg" &&
                file.files[0].type !== "image/png" &&
                file.files[0].type !== "image/jpg" &&
                file.files[0].type !== "image/gif" &&
                file.files[0].type !== "image/svg"
            ) {
                let message =
                    "Image must be in jpeg, png, jpg, gif or svg format ❌";
                notify("error", message);
                return;
            }
        }

        form.submit();
    });
} catch (error) {
    console.log(error);
}
