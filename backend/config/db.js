import mongoose from "mongoose"

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://Ahsanijaz:Pineapple!10@cluster0.5zx3z.mongodb.net/Project').then(()=>console.log("DB Connected"));

}