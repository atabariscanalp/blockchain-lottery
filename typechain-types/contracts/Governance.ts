/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export interface GovernanceInterface extends utils.Interface {
  functions: {
    "duel()": FunctionFragment;
    "init(address,address)": FunctionFragment;
    "randomness()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "duel" | "init" | "randomness"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "duel", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "init",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "randomness",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "duel", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "init", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "randomness", data: BytesLike): Result;

  events: {};
}

export interface Governance extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: GovernanceInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    duel(overrides?: CallOverrides): Promise<[string]>;

    init(
      _randomness: PromiseOrValue<string>,
      _duel: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    randomness(overrides?: CallOverrides): Promise<[string]>;
  };

  duel(overrides?: CallOverrides): Promise<string>;

  init(
    _randomness: PromiseOrValue<string>,
    _duel: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  randomness(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    duel(overrides?: CallOverrides): Promise<string>;

    init(
      _randomness: PromiseOrValue<string>,
      _duel: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    randomness(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    duel(overrides?: CallOverrides): Promise<BigNumber>;

    init(
      _randomness: PromiseOrValue<string>,
      _duel: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    randomness(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    duel(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    init(
      _randomness: PromiseOrValue<string>,
      _duel: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    randomness(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
