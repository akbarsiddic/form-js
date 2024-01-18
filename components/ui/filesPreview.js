import Image from 'next/image';

const FilesPreviewMedia = ({ files, onDeleteClick }) =>
	files?.map((file) => {
		console.log(files, 'filesss');
		let extention = '.pdf';
		if (file?.filename) {
			extention = file?.filename.split('.').pop();
		}
		if (file?.file_name) {
			extention = file?.file_name.split('.').pop();
		}
		const onClick = () => {
			if (extention === 'pdf') {
				window.open(
					`/pdf/viewer?url=${
						file?.file
							? file.file
							: `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/file/${file?.uuid}`
					}`,
					'_blank',
				);
			} else {
				window.open(
					`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/file/${file?.uuid}`,
					'_blank',
				);
			}
		};
		return (
			<div
				className="h-6rem w-5rem me-3 mb-3"
				key={file?.image}
				onClick={() => !onDeleteClick && onClick()}
				aria-hidden>
				<div
					className="border rounded border-primary h-6rem w-5rem d-flex"
					style={{ position: 'relative' }}>
					{(extention === 'jpg' ||
						extention === 'jpeg' ||
						extention === 'png') && (
						<Image
							// src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/file/${file?.uuid}`}
							src={file?.blob}
							style={{
								width: '100%',
								height: '100%',
							}}
							alt="image"
							rounded
							onClick={() => onDeleteClick && onClick()}
						/>
					)}
					{extention === 'mp4' && (
						<>
							<div className="embed-responsive embed-responsive-1by1">
								<iframe
									title="video"
									style={{
										width: '100%',
										height: '100%',
									}}
									className="embed-responsive-item"
									src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/file/${file?.uuid}`}
									allowFullScreen
								/>
							</div>
							<div
								className="rounded rounded-circle bg-gray-300 d-flex border border-primary"
								style={{
									position: 'absolute',
									right: 25,
									top: 4,
								}}
								aria-hidden
								onClick={() => onClick()}>
								{/* <BsFillPlayCircleFill className="align-self-center" /> */}
							</div>
						</>
					)}
					{onDeleteClick && (
						<div
							className="rounded rounded-circle bg-gray-300 d-flex border border-primary"
							style={{
								position: 'absolute',
								right: 4,
								top: 4,
							}}
							aria-hidden
							onClick={() => onDeleteClick(file.id)}>
							{/* <BsX className="align-self-center" /> */}
						</div>
					)}
				</div>
				<div className="w-100" />
				<div className="w-5rem text-truncate">
					<span>
						<small>{file.uuid}</small>
					</span>
				</div>
			</div>
		);
	});

export default FilesPreviewMedia;
