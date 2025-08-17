import { v2 as cloudinary } from "cloudinary";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
	throw new Error("Cloudinary env vars are missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.");
}

cloudinary.config({
	cloud_name: CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
	secure: true,
});

export type CloudinaryUpload = {
	secure_url: string;
	resource_type: string;
	bytes: number;
	format?: string;
	width?: number;
	height?: number;
	public_id: string;
};

export function uploadBuffer(buffer: Buffer, opts: { folder?: string; publicId?: string } = {}): Promise<CloudinaryUpload> {
	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{
				folder: opts.folder ?? "portfolio",
				resource_type: "auto",
				public_id: opts.publicId,
			},
			(err, result) => {
				if (err || !result) return reject(err);
				resolve(result as unknown as CloudinaryUpload);
			}
		);
		stream.end(buffer);
	});
}

export async function uploadFileToCloudinary(file: File, opts: { folder?: string; publicId?: string } = {}) {
	const bytes = await file.arrayBuffer();
	const buffer = Buffer.from(bytes);
	return uploadBuffer(buffer, opts);
}