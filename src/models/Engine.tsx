export interface Engine {
	id: bigint;
	name: string;

	displacement: number;
	power: number;
	torque: number;
	cyllinders: number;

	powertrainId: bigint;
	fuelId: bigint;
	transmissionId: bigint;
}
