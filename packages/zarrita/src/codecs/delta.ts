import type { Chunk, NumberDataType, TypedArrayConstructor } from "../metadata.js"
import { coerce_dtype, get_ctr } from "../util.js"

type DeltaConfig = { dtype: string; }

export class DeltaCodec<D extends NumberDataType> {
    readonly kind = "array_to_array";

    #TypedArray: TypedArrayConstructor<D>;

    constructor(config: DeltaConfig) {
        const { data_type } = coerce_dtype(config.dtype);
        this.#TypedArray = get_ctr(data_type as NumberDataType);
    }

    static fromConfig(config: DeltaConfig) {
        return new DeltaCodec(config);
    }

    encode(_arr: Chunk<D>): Chunk<D> {
	throw new Error("Method not implemented.");
    }

    decode(arr: Chunk<D>): Chunk<D> {
        const out_data = new this.#TypedArray(arr.data.length);
        let prev = 0
        arr.data.forEach((value: number, i: number) => {
            out_data[i] = prev + value
            prev = out_data[i]
        })
        return {
            data: out_data,
            shape: arr.shape,
            stride: arr.stride
        }
    }
}
