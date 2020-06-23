export const uploadFile = (file: any) =>
	new Promise((res, rej) =>
		setTimeout(() => {
			res();
		}, 1000)
	);

export const logUploadedFile = (num: number, color = 'green') => {
	const msg = `%cUploaded ${num} files.`;
	const style = `color:${color};font-weight:bold;`;
	console.log(msg, style);
};
