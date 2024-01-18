import React from 'react';
import { useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useDropzone } from 'react-dropzone';
import filesPreview from '@/components/ui/filesPreview';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';

const specialAdsCategory = [
	'Credit',
	'Employment',
	'Housing',
	'Political',
	'Social Issues',
];

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
];

const formSchema = z.object({
	campaign_name: z.string().min(3).max(50),
	bugdet_mode: z.enum(['daily', 'total']),
	budget: z.coerce.number().min(50),
	objective: z.enum(['traffic', 'conversion', 'app_installs']),
	special_ad_category: z
		.array(z.string())
		.refine((value) => value.some((item) => item), {
			message: 'You have to select at least one item.',
		}),
	media: z.any(),
});

// console.log(media);

const objective = ['traffic', 'conversion', 'app_installs'];

function Tiktok() {
	const [image, setImage] = useState([]);
	const [fileType, setFileType] = useState('');

	const addItem = (files, blobs) => {
		setImage((prevArray) => [...prevArray, { file: files, blob: blobs }]);
	};

	const onDrop = (acceptedFiles) => {
		const file = acceptedFiles[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				addItem(file, reader.result);
			};
			reader.readAsDataURL(file);
			console.log(image);
		}
	};

	const { getRootProps, getInputProps } = useDropzone({
		accept: 'image/*,audio/*,video/*',
		onDrop,
	});

	const exampleObjective = 'traffic';
	const exampleSpecialAdsCategory = ['Credit', 'Employment'];

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			campaign_name: '',
			bugdet_mode: 'daily',
			objective: exampleObjective ? exampleObjective : '',
			special_ad_category: exampleSpecialAdsCategory
				? exampleSpecialAdsCategory
				: [],
			media: null,
		},
	});

	function onSubmit(values) {
		console.log('Form submitted:', values);
		const specialAdCategory = Array.isArray(values.special_ad_category)
			? values.special_ad_category
			: [];

		const updatedValues = {
			...values,
			special_ad_category: specialAdCategory,
			media: image.length > 0 ? image[0].file : null,
		};

		// function imageFormData(image) {
		// 	const formData = new FormData();
		// 	formData.append('media', image[0].file);
		// 	console.log(formData);
		// }

		if (values.media && values.media[0]) {
			const mediaFile = values.media[0];
			// You can handle the file upload logic here
			console.log('Media file:', mediaFile);
		}

		console.log(updatedValues);
		// imageFormData(image);
	}

	return (
		<div className="p-24">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="campaign_name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Campaign Name</FormLabel>
								<FormControl>
									<Input placeholder="Enter campaign name" {...field} />
								</FormControl>
								<FormDescription>
									Provide a name for your campaign.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						type="number"
						name="budget"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Campaign Budget</FormLabel>
								<FormControl>
									<div className="mt-2 flex rounded-md shadow-sm">
										<span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
											IDR
										</span>
										<Input
											{...field}
											className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											placeholder="999"
										/>
									</div>
								</FormControl>
								<FormDescription>
									Provide a budget for your campaign.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="special_ad_category"
						render={() => (
							<FormItem>
								<div className="mb-4">
									<FormLabel className="text-base">Special Ads</FormLabel>
									<FormDescription>
										Select the items you want to display in the sidebar.
									</FormDescription>
								</div>
								{specialAdsCategory.map((item) => (
									<FormField
										key={item}
										control={form.control}
										name="special_ad_category"
										render={({ field }) => {
											return (
												<FormItem
													key={item}
													className="flex flex-row items-start space-x-3 space-y-0">
													<FormControl>
														<Checkbox
															checked={field.value?.includes(item)}
															onCheckedChange={(checked) => {
																return checked
																	? field.onChange([...field.value, item])
																	: field.onChange(
																			field.value?.filter(
																				(value) => value !== item,
																			),
																	  );
															}}
														/>
													</FormControl>
													<FormLabel className="text-sm font-normal">
														{item}
													</FormLabel>
												</FormItem>
											);
										}}
									/>
								))}
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="col-span-full">
						<label
							htmlFor="cover-photo"
							className="block text-sm font-medium leading-6 text-gray-900">
							Media
						</label>
						<div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
							<div className="text-center">
								<div {...getRootProps({ className: 'dropzone' })}>
									<input {...getInputProps()} />
									<p className="message w-100">Drag files here OR</p>
								</div>
								<p className="text-xs leading-5 text-gray-600">
									PNG, JPG, GIF up to 10MB
								</p>
							</div>
						</div>
					</div>
					<filesPreview images={image} />

					<FormField
						control={form.control}
						name="objective"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a verified email to display" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{objective.map((item) => (
											<SelectItem key={item} value={item}>
												{item}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormDescription>
									You can manage email addresses in your{' '}
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit">Submit</Button>
				</form>
			</Form>
		</div>
	);
}

export default Tiktok;
