import { existsSync } from 'fs'
import fs from 'fs/promises'

export const deleteImage = async (imagePath: string) => {
  try {
    // Exclude default images
    if (
      imagePath == 'public/images/products/default-product.png' ||
      imagePath == 'public/images/users/default-user.png'
    )
      return

    // If image path exist, delete it
    if (existsSync(imagePath)) {
      await fs.unlink(imagePath)
    }
  } catch (error) {
    throw error
  }
}
