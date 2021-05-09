export interface Car {
	id: bigint;
	numberPlate: string;

	seats: number;
	luggageSpace: boolean;
	technicallyApproved: boolean;

	modelId: bigint;
	colorId: bigint;
	engineId: bigint;
}
