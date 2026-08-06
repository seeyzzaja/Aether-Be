import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model ChannelPermissionOverride
 *
 */
export type ChannelPermissionOverrideModel = runtime.Types.Result.DefaultSelection<Prisma.$ChannelPermissionOverridePayload>;
export type AggregateChannelPermissionOverride = {
    _count: ChannelPermissionOverrideCountAggregateOutputType | null;
    _avg: ChannelPermissionOverrideAvgAggregateOutputType | null;
    _sum: ChannelPermissionOverrideSumAggregateOutputType | null;
    _min: ChannelPermissionOverrideMinAggregateOutputType | null;
    _max: ChannelPermissionOverrideMaxAggregateOutputType | null;
};
export type ChannelPermissionOverrideAvgAggregateOutputType = {
    allowBitmask: number | null;
    denyBitmask: number | null;
};
export type ChannelPermissionOverrideSumAggregateOutputType = {
    allowBitmask: bigint | null;
    denyBitmask: bigint | null;
};
export type ChannelPermissionOverrideMinAggregateOutputType = {
    id: string | null;
    channelId: string | null;
    roleId: string | null;
    allowBitmask: bigint | null;
    denyBitmask: bigint | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ChannelPermissionOverrideMaxAggregateOutputType = {
    id: string | null;
    channelId: string | null;
    roleId: string | null;
    allowBitmask: bigint | null;
    denyBitmask: bigint | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ChannelPermissionOverrideCountAggregateOutputType = {
    id: number;
    channelId: number;
    roleId: number;
    allowBitmask: number;
    denyBitmask: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ChannelPermissionOverrideAvgAggregateInputType = {
    allowBitmask?: true;
    denyBitmask?: true;
};
export type ChannelPermissionOverrideSumAggregateInputType = {
    allowBitmask?: true;
    denyBitmask?: true;
};
export type ChannelPermissionOverrideMinAggregateInputType = {
    id?: true;
    channelId?: true;
    roleId?: true;
    allowBitmask?: true;
    denyBitmask?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ChannelPermissionOverrideMaxAggregateInputType = {
    id?: true;
    channelId?: true;
    roleId?: true;
    allowBitmask?: true;
    denyBitmask?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ChannelPermissionOverrideCountAggregateInputType = {
    id?: true;
    channelId?: true;
    roleId?: true;
    allowBitmask?: true;
    denyBitmask?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ChannelPermissionOverrideAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ChannelPermissionOverride to aggregate.
     */
    where?: Prisma.ChannelPermissionOverrideWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ChannelPermissionOverrides to fetch.
     */
    orderBy?: Prisma.ChannelPermissionOverrideOrderByWithRelationInput | Prisma.ChannelPermissionOverrideOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.ChannelPermissionOverrideWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ChannelPermissionOverrides from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ChannelPermissionOverrides.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ChannelPermissionOverrides
    **/
    _count?: true | ChannelPermissionOverrideCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: ChannelPermissionOverrideAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: ChannelPermissionOverrideSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: ChannelPermissionOverrideMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: ChannelPermissionOverrideMaxAggregateInputType;
};
export type GetChannelPermissionOverrideAggregateType<T extends ChannelPermissionOverrideAggregateArgs> = {
    [P in keyof T & keyof AggregateChannelPermissionOverride]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateChannelPermissionOverride[P]> : Prisma.GetScalarType<T[P], AggregateChannelPermissionOverride[P]>;
};
export type ChannelPermissionOverrideGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChannelPermissionOverrideWhereInput;
    orderBy?: Prisma.ChannelPermissionOverrideOrderByWithAggregationInput | Prisma.ChannelPermissionOverrideOrderByWithAggregationInput[];
    by: Prisma.ChannelPermissionOverrideScalarFieldEnum[] | Prisma.ChannelPermissionOverrideScalarFieldEnum;
    having?: Prisma.ChannelPermissionOverrideScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ChannelPermissionOverrideCountAggregateInputType | true;
    _avg?: ChannelPermissionOverrideAvgAggregateInputType;
    _sum?: ChannelPermissionOverrideSumAggregateInputType;
    _min?: ChannelPermissionOverrideMinAggregateInputType;
    _max?: ChannelPermissionOverrideMaxAggregateInputType;
};
export type ChannelPermissionOverrideGroupByOutputType = {
    id: string;
    channelId: string;
    roleId: string;
    allowBitmask: bigint;
    denyBitmask: bigint;
    createdAt: Date;
    updatedAt: Date;
    _count: ChannelPermissionOverrideCountAggregateOutputType | null;
    _avg: ChannelPermissionOverrideAvgAggregateOutputType | null;
    _sum: ChannelPermissionOverrideSumAggregateOutputType | null;
    _min: ChannelPermissionOverrideMinAggregateOutputType | null;
    _max: ChannelPermissionOverrideMaxAggregateOutputType | null;
};
export type GetChannelPermissionOverrideGroupByPayload<T extends ChannelPermissionOverrideGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ChannelPermissionOverrideGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ChannelPermissionOverrideGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ChannelPermissionOverrideGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ChannelPermissionOverrideGroupByOutputType[P]>;
}>>;
export type ChannelPermissionOverrideWhereInput = {
    AND?: Prisma.ChannelPermissionOverrideWhereInput | Prisma.ChannelPermissionOverrideWhereInput[];
    OR?: Prisma.ChannelPermissionOverrideWhereInput[];
    NOT?: Prisma.ChannelPermissionOverrideWhereInput | Prisma.ChannelPermissionOverrideWhereInput[];
    id?: Prisma.StringFilter<"ChannelPermissionOverride"> | string;
    channelId?: Prisma.StringFilter<"ChannelPermissionOverride"> | string;
    roleId?: Prisma.StringFilter<"ChannelPermissionOverride"> | string;
    allowBitmask?: Prisma.BigIntFilter<"ChannelPermissionOverride"> | bigint | number;
    denyBitmask?: Prisma.BigIntFilter<"ChannelPermissionOverride"> | bigint | number;
    createdAt?: Prisma.DateTimeFilter<"ChannelPermissionOverride"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ChannelPermissionOverride"> | Date | string;
    channel?: Prisma.XOR<Prisma.ChannelScalarRelationFilter, Prisma.ChannelWhereInput>;
    role?: Prisma.XOR<Prisma.RoleScalarRelationFilter, Prisma.RoleWhereInput>;
};
export type ChannelPermissionOverrideOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    channelId?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    allowBitmask?: Prisma.SortOrder;
    denyBitmask?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    channel?: Prisma.ChannelOrderByWithRelationInput;
    role?: Prisma.RoleOrderByWithRelationInput;
};
export type ChannelPermissionOverrideWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    channelId_roleId?: Prisma.ChannelPermissionOverrideChannelIdRoleIdCompoundUniqueInput;
    AND?: Prisma.ChannelPermissionOverrideWhereInput | Prisma.ChannelPermissionOverrideWhereInput[];
    OR?: Prisma.ChannelPermissionOverrideWhereInput[];
    NOT?: Prisma.ChannelPermissionOverrideWhereInput | Prisma.ChannelPermissionOverrideWhereInput[];
    channelId?: Prisma.StringFilter<"ChannelPermissionOverride"> | string;
    roleId?: Prisma.StringFilter<"ChannelPermissionOverride"> | string;
    allowBitmask?: Prisma.BigIntFilter<"ChannelPermissionOverride"> | bigint | number;
    denyBitmask?: Prisma.BigIntFilter<"ChannelPermissionOverride"> | bigint | number;
    createdAt?: Prisma.DateTimeFilter<"ChannelPermissionOverride"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ChannelPermissionOverride"> | Date | string;
    channel?: Prisma.XOR<Prisma.ChannelScalarRelationFilter, Prisma.ChannelWhereInput>;
    role?: Prisma.XOR<Prisma.RoleScalarRelationFilter, Prisma.RoleWhereInput>;
}, "id" | "channelId_roleId">;
export type ChannelPermissionOverrideOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    channelId?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    allowBitmask?: Prisma.SortOrder;
    denyBitmask?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ChannelPermissionOverrideCountOrderByAggregateInput;
    _avg?: Prisma.ChannelPermissionOverrideAvgOrderByAggregateInput;
    _max?: Prisma.ChannelPermissionOverrideMaxOrderByAggregateInput;
    _min?: Prisma.ChannelPermissionOverrideMinOrderByAggregateInput;
    _sum?: Prisma.ChannelPermissionOverrideSumOrderByAggregateInput;
};
export type ChannelPermissionOverrideScalarWhereWithAggregatesInput = {
    AND?: Prisma.ChannelPermissionOverrideScalarWhereWithAggregatesInput | Prisma.ChannelPermissionOverrideScalarWhereWithAggregatesInput[];
    OR?: Prisma.ChannelPermissionOverrideScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ChannelPermissionOverrideScalarWhereWithAggregatesInput | Prisma.ChannelPermissionOverrideScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ChannelPermissionOverride"> | string;
    channelId?: Prisma.StringWithAggregatesFilter<"ChannelPermissionOverride"> | string;
    roleId?: Prisma.StringWithAggregatesFilter<"ChannelPermissionOverride"> | string;
    allowBitmask?: Prisma.BigIntWithAggregatesFilter<"ChannelPermissionOverride"> | bigint | number;
    denyBitmask?: Prisma.BigIntWithAggregatesFilter<"ChannelPermissionOverride"> | bigint | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ChannelPermissionOverride"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"ChannelPermissionOverride"> | Date | string;
};
export type ChannelPermissionOverrideCreateInput = {
    id?: string;
    allowBitmask?: bigint | number;
    denyBitmask?: bigint | number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    channel: Prisma.ChannelCreateNestedOneWithoutPermissionOverridesInput;
    role: Prisma.RoleCreateNestedOneWithoutChannelPermissionOverridesInput;
};
export type ChannelPermissionOverrideUncheckedCreateInput = {
    id?: string;
    channelId: string;
    roleId: string;
    allowBitmask?: bigint | number;
    denyBitmask?: bigint | number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ChannelPermissionOverrideUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    allowBitmask?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    denyBitmask?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    channel?: Prisma.ChannelUpdateOneRequiredWithoutPermissionOverridesNestedInput;
    role?: Prisma.RoleUpdateOneRequiredWithoutChannelPermissionOverridesNestedInput;
};
export type ChannelPermissionOverrideUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    channelId?: Prisma.StringFieldUpdateOperationsInput | string;
    roleId?: Prisma.StringFieldUpdateOperationsInput | string;
    allowBitmask?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    denyBitmask?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelPermissionOverrideCreateManyInput = {
    id?: string;
    channelId: string;
    roleId: string;
    allowBitmask?: bigint | number;
    denyBitmask?: bigint | number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ChannelPermissionOverrideUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    allowBitmask?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    denyBitmask?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelPermissionOverrideUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    channelId?: Prisma.StringFieldUpdateOperationsInput | string;
    roleId?: Prisma.StringFieldUpdateOperationsInput | string;
    allowBitmask?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    denyBitmask?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelPermissionOverrideChannelIdRoleIdCompoundUniqueInput = {
    channelId: string;
    roleId: string;
};
export type ChannelPermissionOverrideCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    channelId?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    allowBitmask?: Prisma.SortOrder;
    denyBitmask?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ChannelPermissionOverrideAvgOrderByAggregateInput = {
    allowBitmask?: Prisma.SortOrder;
    denyBitmask?: Prisma.SortOrder;
};
export type ChannelPermissionOverrideMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    channelId?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    allowBitmask?: Prisma.SortOrder;
    denyBitmask?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ChannelPermissionOverrideMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    channelId?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    allowBitmask?: Prisma.SortOrder;
    denyBitmask?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ChannelPermissionOverrideSumOrderByAggregateInput = {
    allowBitmask?: Prisma.SortOrder;
    denyBitmask?: Prisma.SortOrder;
};
export type ChannelPermissionOverrideListRelationFilter = {
    every?: Prisma.ChannelPermissionOverrideWhereInput;
    some?: Prisma.ChannelPermissionOverrideWhereInput;
    none?: Prisma.ChannelPermissionOverrideWhereInput;
};
export type ChannelPermissionOverrideOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number;
    increment?: bigint | number;
    decrement?: bigint | number;
    multiply?: bigint | number;
    divide?: bigint | number;
};
export type ChannelPermissionOverrideCreateNestedManyWithoutChannelInput = {
    create?: Prisma.XOR<Prisma.ChannelPermissionOverrideCreateWithoutChannelInput, Prisma.ChannelPermissionOverrideUncheckedCreateWithoutChannelInput> | Prisma.ChannelPermissionOverrideCreateWithoutChannelInput[] | Prisma.ChannelPermissionOverrideUncheckedCreateWithoutChannelInput[];
    connectOrCreate?: Prisma.ChannelPermissionOverrideCreateOrConnectWithoutChannelInput | Prisma.ChannelPermissionOverrideCreateOrConnectWithoutChannelInput[];
    createMany?: Prisma.ChannelPermissionOverrideCreateManyChannelInputEnvelope;
    connect?: Prisma.ChannelPermissionOverrideWhereUniqueInput | Prisma.ChannelPermissionOverrideWhereUniqueInput[];
};
export type ChannelPermissionOverrideUncheckedCreateNestedManyWithoutChannelInput = {
    create?: Prisma.XOR<Prisma.ChannelPermissionOverrideCreateWithoutChannelInput, Prisma.ChannelPermissionOverrideUncheckedCreateWithoutChannelInput> | Prisma.ChannelPermissionOverrideCreateWithoutChannelInput[] | Prisma.ChannelPermissionOverrideUncheckedCreateWithoutChannelInput[];
    connectOrCreate?: Prisma.ChannelPermissionOverrideCreateOrConnectWithoutChannelInput | Prisma.ChannelPermissionOverrideCreateOrConnectWithoutChannelInput[];
    createMany?: Prisma.ChannelPermissionOverrideCreateManyChannelInputEnvelope;
    connect?: Prisma.ChannelPermissionOverrideWhereUniqueInput | Prisma.ChannelPermissionOverrideWhereUniqueInput[];
};
export type ChannelPermissionOverrideUpdateManyWithoutChannelNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelPermissionOverrideCreateWithoutChannelInput, Prisma.ChannelPermissionOverrideUncheckedCreateWithoutChannelInput> | Prisma.ChannelPermissionOverrideCreateWithoutChannelInput[] | Prisma.ChannelPermissionOverrideUncheckedCreateWithoutChannelInput[];
    connectOrCreate?: Prisma.ChannelPermissionOverrideCreateOrConnectWithoutChannelInput | Prisma.ChannelPermissionOverrideCreateOrConnectWithoutChannelInput[];
    upsert?: Prisma.ChannelPermissionOverrideUpsertWithWhereUniqueWithoutChannelInput | Prisma.ChannelPermissionOverrideUpsertWithWhereUniqueWithoutChannelInput[];
    createMany?: Prisma.ChannelPermissionOverrideCreateManyChannelInputEnvelope;
    set?: Prisma.ChannelPermissionOverrideWhereUniqueInput | Prisma.ChannelPermissionOverrideWhereUniqueInput[];
    disconnect?: Prisma.ChannelPermissionOverrideWhereUniqueInput | Prisma.ChannelPermissionOverrideWhereUniqueInput[];
    delete?: Prisma.ChannelPermissionOverrideWhereUniqueInput | Prisma.ChannelPermissionOverrideWhereUniqueInput[];
    connect?: Prisma.ChannelPermissionOverrideWhereUniqueInput | Prisma.ChannelPermissionOverrideWhereUniqueInput[];
    update?: Prisma.ChannelPermissionOverrideUpdateWithWhereUniqueWithoutChannelInput | Prisma.ChannelPermissionOverrideUpdateWithWhereUniqueWithoutChannelInput[];
    updateMany?: Prisma.ChannelPermissionOverrideUpdateManyWithWhereWithoutChannelInput | Prisma.ChannelPermissionOverrideUpdateManyWithWhereWithoutChannelInput[];
    deleteMany?: Prisma.ChannelPermissionOverrideScalarWhereInput | Prisma.ChannelPermissionOverrideScalarWhereInput[];
};
export type ChannelPermissionOverrideUncheckedUpdateManyWithoutChannelNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelPermissionOverrideCreateWithoutChannelInput, Prisma.ChannelPermissionOverrideUncheckedCreateWithoutChannelInput> | Prisma.ChannelPermissionOverrideCreateWithoutChannelInput[] | Prisma.ChannelPermissionOverrideUncheckedCreateWithoutChannelInput[];
    connectOrCreate?: Prisma.ChannelPermissionOverrideCreateOrConnectWithoutChannelInput | Prisma.ChannelPermissionOverrideCreateOrConnectWithoutChannelInput[];
    upsert?: Prisma.ChannelPermissionOverrideUpsertWithWhereUniqueWithoutChannelInput | Prisma.ChannelPermissionOverrideUpsertWithWhereUniqueWithoutChannelInput[];
    createMany?: Prisma.ChannelPermissionOverrideCreateManyChannelInputEnvelope;
    set?: Prisma.ChannelPermissionOverrideWhereUniqueInput | Prisma.ChannelPermissionOverrideWhereUniqueInput[];
    disconnect?: Prisma.ChannelPermissionOverrideWhereUniqueInput | Prisma.ChannelPermissionOverrideWhereUniqueInput[];
    delete?: Prisma.ChannelPermissionOverrideWhereUniqueInput | Prisma.ChannelPermissionOverrideWhereUniqueInput[];
    connect?: Prisma.ChannelPermissionOverrideWhereUniqueInput | Prisma.ChannelPermissionOverrideWhereUniqueInput[];
    update?: Prisma.ChannelPermissionOverrideUpdateWithWhereUniqueWithoutChannelInput | Prisma.ChannelPermissionOverrideUpdateWithWhereUniqueWithoutChannelInput[];
    updateMany?: Prisma.ChannelPermissionOverrideUpdateManyWithWhereWithoutChannelInput | Prisma.ChannelPermissionOverrideUpdateManyWithWhereWithoutChannelInput[];
    deleteMany?: Prisma.ChannelPermissionOverrideScalarWhereInput | Prisma.ChannelPermissionOverrideScalarWhereInput[];
};
export type ChannelPermissionOverrideCreateNestedManyWithoutRoleInput = {
    create?: Prisma.XOR<Prisma.ChannelPermissionOverrideCreateWithoutRoleInput, Prisma.ChannelPermissionOverrideUncheckedCreateWithoutRoleInput> | Prisma.ChannelPermissionOverrideCreateWithoutRoleInput[] | Prisma.ChannelPermissionOverrideUncheckedCreateWithoutRoleInput[];
    connectOrCreate?: Prisma.ChannelPermissionOverrideCreateOrConnectWithoutRoleInput | Prisma.ChannelPermissionOverrideCreateOrConnectWithoutRoleInput[];
    createMany?: Prisma.ChannelPermissionOverrideCreateManyRoleInputEnvelope;
    connect?: Prisma.ChannelPermissionOverrideWhereUniqueInput | Prisma.ChannelPermissionOverrideWhereUniqueInput[];
};
export type ChannelPermissionOverrideUncheckedCreateNestedManyWithoutRoleInput = {
    create?: Prisma.XOR<Prisma.ChannelPermissionOverrideCreateWithoutRoleInput, Prisma.ChannelPermissionOverrideUncheckedCreateWithoutRoleInput> | Prisma.ChannelPermissionOverrideCreateWithoutRoleInput[] | Prisma.ChannelPermissionOverrideUncheckedCreateWithoutRoleInput[];
    connectOrCreate?: Prisma.ChannelPermissionOverrideCreateOrConnectWithoutRoleInput | Prisma.ChannelPermissionOverrideCreateOrConnectWithoutRoleInput[];
    createMany?: Prisma.ChannelPermissionOverrideCreateManyRoleInputEnvelope;
    connect?: Prisma.ChannelPermissionOverrideWhereUniqueInput | Prisma.ChannelPermissionOverrideWhereUniqueInput[];
};
export type ChannelPermissionOverrideUpdateManyWithoutRoleNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelPermissionOverrideCreateWithoutRoleInput, Prisma.ChannelPermissionOverrideUncheckedCreateWithoutRoleInput> | Prisma.ChannelPermissionOverrideCreateWithoutRoleInput[] | Prisma.ChannelPermissionOverrideUncheckedCreateWithoutRoleInput[];
    connectOrCreate?: Prisma.ChannelPermissionOverrideCreateOrConnectWithoutRoleInput | Prisma.ChannelPermissionOverrideCreateOrConnectWithoutRoleInput[];
    upsert?: Prisma.ChannelPermissionOverrideUpsertWithWhereUniqueWithoutRoleInput | Prisma.ChannelPermissionOverrideUpsertWithWhereUniqueWithoutRoleInput[];
    createMany?: Prisma.ChannelPermissionOverrideCreateManyRoleInputEnvelope;
    set?: Prisma.ChannelPermissionOverrideWhereUniqueInput | Prisma.ChannelPermissionOverrideWhereUniqueInput[];
    disconnect?: Prisma.ChannelPermissionOverrideWhereUniqueInput | Prisma.ChannelPermissionOverrideWhereUniqueInput[];
    delete?: Prisma.ChannelPermissionOverrideWhereUniqueInput | Prisma.ChannelPermissionOverrideWhereUniqueInput[];
    connect?: Prisma.ChannelPermissionOverrideWhereUniqueInput | Prisma.ChannelPermissionOverrideWhereUniqueInput[];
    update?: Prisma.ChannelPermissionOverrideUpdateWithWhereUniqueWithoutRoleInput | Prisma.ChannelPermissionOverrideUpdateWithWhereUniqueWithoutRoleInput[];
    updateMany?: Prisma.ChannelPermissionOverrideUpdateManyWithWhereWithoutRoleInput | Prisma.ChannelPermissionOverrideUpdateManyWithWhereWithoutRoleInput[];
    deleteMany?: Prisma.ChannelPermissionOverrideScalarWhereInput | Prisma.ChannelPermissionOverrideScalarWhereInput[];
};
export type ChannelPermissionOverrideUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelPermissionOverrideCreateWithoutRoleInput, Prisma.ChannelPermissionOverrideUncheckedCreateWithoutRoleInput> | Prisma.ChannelPermissionOverrideCreateWithoutRoleInput[] | Prisma.ChannelPermissionOverrideUncheckedCreateWithoutRoleInput[];
    connectOrCreate?: Prisma.ChannelPermissionOverrideCreateOrConnectWithoutRoleInput | Prisma.ChannelPermissionOverrideCreateOrConnectWithoutRoleInput[];
    upsert?: Prisma.ChannelPermissionOverrideUpsertWithWhereUniqueWithoutRoleInput | Prisma.ChannelPermissionOverrideUpsertWithWhereUniqueWithoutRoleInput[];
    createMany?: Prisma.ChannelPermissionOverrideCreateManyRoleInputEnvelope;
    set?: Prisma.ChannelPermissionOverrideWhereUniqueInput | Prisma.ChannelPermissionOverrideWhereUniqueInput[];
    disconnect?: Prisma.ChannelPermissionOverrideWhereUniqueInput | Prisma.ChannelPermissionOverrideWhereUniqueInput[];
    delete?: Prisma.ChannelPermissionOverrideWhereUniqueInput | Prisma.ChannelPermissionOverrideWhereUniqueInput[];
    connect?: Prisma.ChannelPermissionOverrideWhereUniqueInput | Prisma.ChannelPermissionOverrideWhereUniqueInput[];
    update?: Prisma.ChannelPermissionOverrideUpdateWithWhereUniqueWithoutRoleInput | Prisma.ChannelPermissionOverrideUpdateWithWhereUniqueWithoutRoleInput[];
    updateMany?: Prisma.ChannelPermissionOverrideUpdateManyWithWhereWithoutRoleInput | Prisma.ChannelPermissionOverrideUpdateManyWithWhereWithoutRoleInput[];
    deleteMany?: Prisma.ChannelPermissionOverrideScalarWhereInput | Prisma.ChannelPermissionOverrideScalarWhereInput[];
};
export type ChannelPermissionOverrideCreateWithoutChannelInput = {
    id?: string;
    allowBitmask?: bigint | number;
    denyBitmask?: bigint | number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    role: Prisma.RoleCreateNestedOneWithoutChannelPermissionOverridesInput;
};
export type ChannelPermissionOverrideUncheckedCreateWithoutChannelInput = {
    id?: string;
    roleId: string;
    allowBitmask?: bigint | number;
    denyBitmask?: bigint | number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ChannelPermissionOverrideCreateOrConnectWithoutChannelInput = {
    where: Prisma.ChannelPermissionOverrideWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChannelPermissionOverrideCreateWithoutChannelInput, Prisma.ChannelPermissionOverrideUncheckedCreateWithoutChannelInput>;
};
export type ChannelPermissionOverrideCreateManyChannelInputEnvelope = {
    data: Prisma.ChannelPermissionOverrideCreateManyChannelInput | Prisma.ChannelPermissionOverrideCreateManyChannelInput[];
    skipDuplicates?: boolean;
};
export type ChannelPermissionOverrideUpsertWithWhereUniqueWithoutChannelInput = {
    where: Prisma.ChannelPermissionOverrideWhereUniqueInput;
    update: Prisma.XOR<Prisma.ChannelPermissionOverrideUpdateWithoutChannelInput, Prisma.ChannelPermissionOverrideUncheckedUpdateWithoutChannelInput>;
    create: Prisma.XOR<Prisma.ChannelPermissionOverrideCreateWithoutChannelInput, Prisma.ChannelPermissionOverrideUncheckedCreateWithoutChannelInput>;
};
export type ChannelPermissionOverrideUpdateWithWhereUniqueWithoutChannelInput = {
    where: Prisma.ChannelPermissionOverrideWhereUniqueInput;
    data: Prisma.XOR<Prisma.ChannelPermissionOverrideUpdateWithoutChannelInput, Prisma.ChannelPermissionOverrideUncheckedUpdateWithoutChannelInput>;
};
export type ChannelPermissionOverrideUpdateManyWithWhereWithoutChannelInput = {
    where: Prisma.ChannelPermissionOverrideScalarWhereInput;
    data: Prisma.XOR<Prisma.ChannelPermissionOverrideUpdateManyMutationInput, Prisma.ChannelPermissionOverrideUncheckedUpdateManyWithoutChannelInput>;
};
export type ChannelPermissionOverrideScalarWhereInput = {
    AND?: Prisma.ChannelPermissionOverrideScalarWhereInput | Prisma.ChannelPermissionOverrideScalarWhereInput[];
    OR?: Prisma.ChannelPermissionOverrideScalarWhereInput[];
    NOT?: Prisma.ChannelPermissionOverrideScalarWhereInput | Prisma.ChannelPermissionOverrideScalarWhereInput[];
    id?: Prisma.StringFilter<"ChannelPermissionOverride"> | string;
    channelId?: Prisma.StringFilter<"ChannelPermissionOverride"> | string;
    roleId?: Prisma.StringFilter<"ChannelPermissionOverride"> | string;
    allowBitmask?: Prisma.BigIntFilter<"ChannelPermissionOverride"> | bigint | number;
    denyBitmask?: Prisma.BigIntFilter<"ChannelPermissionOverride"> | bigint | number;
    createdAt?: Prisma.DateTimeFilter<"ChannelPermissionOverride"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ChannelPermissionOverride"> | Date | string;
};
export type ChannelPermissionOverrideCreateWithoutRoleInput = {
    id?: string;
    allowBitmask?: bigint | number;
    denyBitmask?: bigint | number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    channel: Prisma.ChannelCreateNestedOneWithoutPermissionOverridesInput;
};
export type ChannelPermissionOverrideUncheckedCreateWithoutRoleInput = {
    id?: string;
    channelId: string;
    allowBitmask?: bigint | number;
    denyBitmask?: bigint | number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ChannelPermissionOverrideCreateOrConnectWithoutRoleInput = {
    where: Prisma.ChannelPermissionOverrideWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChannelPermissionOverrideCreateWithoutRoleInput, Prisma.ChannelPermissionOverrideUncheckedCreateWithoutRoleInput>;
};
export type ChannelPermissionOverrideCreateManyRoleInputEnvelope = {
    data: Prisma.ChannelPermissionOverrideCreateManyRoleInput | Prisma.ChannelPermissionOverrideCreateManyRoleInput[];
    skipDuplicates?: boolean;
};
export type ChannelPermissionOverrideUpsertWithWhereUniqueWithoutRoleInput = {
    where: Prisma.ChannelPermissionOverrideWhereUniqueInput;
    update: Prisma.XOR<Prisma.ChannelPermissionOverrideUpdateWithoutRoleInput, Prisma.ChannelPermissionOverrideUncheckedUpdateWithoutRoleInput>;
    create: Prisma.XOR<Prisma.ChannelPermissionOverrideCreateWithoutRoleInput, Prisma.ChannelPermissionOverrideUncheckedCreateWithoutRoleInput>;
};
export type ChannelPermissionOverrideUpdateWithWhereUniqueWithoutRoleInput = {
    where: Prisma.ChannelPermissionOverrideWhereUniqueInput;
    data: Prisma.XOR<Prisma.ChannelPermissionOverrideUpdateWithoutRoleInput, Prisma.ChannelPermissionOverrideUncheckedUpdateWithoutRoleInput>;
};
export type ChannelPermissionOverrideUpdateManyWithWhereWithoutRoleInput = {
    where: Prisma.ChannelPermissionOverrideScalarWhereInput;
    data: Prisma.XOR<Prisma.ChannelPermissionOverrideUpdateManyMutationInput, Prisma.ChannelPermissionOverrideUncheckedUpdateManyWithoutRoleInput>;
};
export type ChannelPermissionOverrideCreateManyChannelInput = {
    id?: string;
    roleId: string;
    allowBitmask?: bigint | number;
    denyBitmask?: bigint | number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ChannelPermissionOverrideUpdateWithoutChannelInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    allowBitmask?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    denyBitmask?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    role?: Prisma.RoleUpdateOneRequiredWithoutChannelPermissionOverridesNestedInput;
};
export type ChannelPermissionOverrideUncheckedUpdateWithoutChannelInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    roleId?: Prisma.StringFieldUpdateOperationsInput | string;
    allowBitmask?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    denyBitmask?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelPermissionOverrideUncheckedUpdateManyWithoutChannelInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    roleId?: Prisma.StringFieldUpdateOperationsInput | string;
    allowBitmask?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    denyBitmask?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelPermissionOverrideCreateManyRoleInput = {
    id?: string;
    channelId: string;
    allowBitmask?: bigint | number;
    denyBitmask?: bigint | number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ChannelPermissionOverrideUpdateWithoutRoleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    allowBitmask?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    denyBitmask?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    channel?: Prisma.ChannelUpdateOneRequiredWithoutPermissionOverridesNestedInput;
};
export type ChannelPermissionOverrideUncheckedUpdateWithoutRoleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    channelId?: Prisma.StringFieldUpdateOperationsInput | string;
    allowBitmask?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    denyBitmask?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelPermissionOverrideUncheckedUpdateManyWithoutRoleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    channelId?: Prisma.StringFieldUpdateOperationsInput | string;
    allowBitmask?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    denyBitmask?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelPermissionOverrideSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    channelId?: boolean;
    roleId?: boolean;
    allowBitmask?: boolean;
    denyBitmask?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    channel?: boolean | Prisma.ChannelDefaultArgs<ExtArgs>;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["channelPermissionOverride"]>;
export type ChannelPermissionOverrideSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    channelId?: boolean;
    roleId?: boolean;
    allowBitmask?: boolean;
    denyBitmask?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    channel?: boolean | Prisma.ChannelDefaultArgs<ExtArgs>;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["channelPermissionOverride"]>;
export type ChannelPermissionOverrideSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    channelId?: boolean;
    roleId?: boolean;
    allowBitmask?: boolean;
    denyBitmask?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    channel?: boolean | Prisma.ChannelDefaultArgs<ExtArgs>;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["channelPermissionOverride"]>;
export type ChannelPermissionOverrideSelectScalar = {
    id?: boolean;
    channelId?: boolean;
    roleId?: boolean;
    allowBitmask?: boolean;
    denyBitmask?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ChannelPermissionOverrideOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "channelId" | "roleId" | "allowBitmask" | "denyBitmask" | "createdAt" | "updatedAt", ExtArgs["result"]["channelPermissionOverride"]>;
export type ChannelPermissionOverrideInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    channel?: boolean | Prisma.ChannelDefaultArgs<ExtArgs>;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
};
export type ChannelPermissionOverrideIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    channel?: boolean | Prisma.ChannelDefaultArgs<ExtArgs>;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
};
export type ChannelPermissionOverrideIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    channel?: boolean | Prisma.ChannelDefaultArgs<ExtArgs>;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
};
export type $ChannelPermissionOverridePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ChannelPermissionOverride";
    objects: {
        channel: Prisma.$ChannelPayload<ExtArgs>;
        role: Prisma.$RolePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        channelId: string;
        roleId: string;
        allowBitmask: bigint;
        denyBitmask: bigint;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["channelPermissionOverride"]>;
    composites: {};
};
export type ChannelPermissionOverrideGetPayload<S extends boolean | null | undefined | ChannelPermissionOverrideDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ChannelPermissionOverridePayload, S>;
export type ChannelPermissionOverrideCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ChannelPermissionOverrideFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ChannelPermissionOverrideCountAggregateInputType | true;
};
export interface ChannelPermissionOverrideDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ChannelPermissionOverride'];
        meta: {
            name: 'ChannelPermissionOverride';
        };
    };
    /**
     * Find zero or one ChannelPermissionOverride that matches the filter.
     * @param {ChannelPermissionOverrideFindUniqueArgs} args - Arguments to find a ChannelPermissionOverride
     * @example
     * // Get one ChannelPermissionOverride
     * const channelPermissionOverride = await prisma.channelPermissionOverride.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChannelPermissionOverrideFindUniqueArgs>(args: Prisma.SelectSubset<T, ChannelPermissionOverrideFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ChannelPermissionOverrideClient<runtime.Types.Result.GetResult<Prisma.$ChannelPermissionOverridePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one ChannelPermissionOverride that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChannelPermissionOverrideFindUniqueOrThrowArgs} args - Arguments to find a ChannelPermissionOverride
     * @example
     * // Get one ChannelPermissionOverride
     * const channelPermissionOverride = await prisma.channelPermissionOverride.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChannelPermissionOverrideFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ChannelPermissionOverrideFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ChannelPermissionOverrideClient<runtime.Types.Result.GetResult<Prisma.$ChannelPermissionOverridePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ChannelPermissionOverride that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChannelPermissionOverrideFindFirstArgs} args - Arguments to find a ChannelPermissionOverride
     * @example
     * // Get one ChannelPermissionOverride
     * const channelPermissionOverride = await prisma.channelPermissionOverride.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChannelPermissionOverrideFindFirstArgs>(args?: Prisma.SelectSubset<T, ChannelPermissionOverrideFindFirstArgs<ExtArgs>>): Prisma.Prisma__ChannelPermissionOverrideClient<runtime.Types.Result.GetResult<Prisma.$ChannelPermissionOverridePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ChannelPermissionOverride that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChannelPermissionOverrideFindFirstOrThrowArgs} args - Arguments to find a ChannelPermissionOverride
     * @example
     * // Get one ChannelPermissionOverride
     * const channelPermissionOverride = await prisma.channelPermissionOverride.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChannelPermissionOverrideFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ChannelPermissionOverrideFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ChannelPermissionOverrideClient<runtime.Types.Result.GetResult<Prisma.$ChannelPermissionOverridePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more ChannelPermissionOverrides that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChannelPermissionOverrideFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChannelPermissionOverrides
     * const channelPermissionOverrides = await prisma.channelPermissionOverride.findMany()
     *
     * // Get first 10 ChannelPermissionOverrides
     * const channelPermissionOverrides = await prisma.channelPermissionOverride.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const channelPermissionOverrideWithIdOnly = await prisma.channelPermissionOverride.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ChannelPermissionOverrideFindManyArgs>(args?: Prisma.SelectSubset<T, ChannelPermissionOverrideFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChannelPermissionOverridePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a ChannelPermissionOverride.
     * @param {ChannelPermissionOverrideCreateArgs} args - Arguments to create a ChannelPermissionOverride.
     * @example
     * // Create one ChannelPermissionOverride
     * const ChannelPermissionOverride = await prisma.channelPermissionOverride.create({
     *   data: {
     *     // ... data to create a ChannelPermissionOverride
     *   }
     * })
     *
     */
    create<T extends ChannelPermissionOverrideCreateArgs>(args: Prisma.SelectSubset<T, ChannelPermissionOverrideCreateArgs<ExtArgs>>): Prisma.Prisma__ChannelPermissionOverrideClient<runtime.Types.Result.GetResult<Prisma.$ChannelPermissionOverridePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many ChannelPermissionOverrides.
     * @param {ChannelPermissionOverrideCreateManyArgs} args - Arguments to create many ChannelPermissionOverrides.
     * @example
     * // Create many ChannelPermissionOverrides
     * const channelPermissionOverride = await prisma.channelPermissionOverride.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ChannelPermissionOverrideCreateManyArgs>(args?: Prisma.SelectSubset<T, ChannelPermissionOverrideCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many ChannelPermissionOverrides and returns the data saved in the database.
     * @param {ChannelPermissionOverrideCreateManyAndReturnArgs} args - Arguments to create many ChannelPermissionOverrides.
     * @example
     * // Create many ChannelPermissionOverrides
     * const channelPermissionOverride = await prisma.channelPermissionOverride.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ChannelPermissionOverrides and only return the `id`
     * const channelPermissionOverrideWithIdOnly = await prisma.channelPermissionOverride.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ChannelPermissionOverrideCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ChannelPermissionOverrideCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChannelPermissionOverridePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a ChannelPermissionOverride.
     * @param {ChannelPermissionOverrideDeleteArgs} args - Arguments to delete one ChannelPermissionOverride.
     * @example
     * // Delete one ChannelPermissionOverride
     * const ChannelPermissionOverride = await prisma.channelPermissionOverride.delete({
     *   where: {
     *     // ... filter to delete one ChannelPermissionOverride
     *   }
     * })
     *
     */
    delete<T extends ChannelPermissionOverrideDeleteArgs>(args: Prisma.SelectSubset<T, ChannelPermissionOverrideDeleteArgs<ExtArgs>>): Prisma.Prisma__ChannelPermissionOverrideClient<runtime.Types.Result.GetResult<Prisma.$ChannelPermissionOverridePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one ChannelPermissionOverride.
     * @param {ChannelPermissionOverrideUpdateArgs} args - Arguments to update one ChannelPermissionOverride.
     * @example
     * // Update one ChannelPermissionOverride
     * const channelPermissionOverride = await prisma.channelPermissionOverride.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ChannelPermissionOverrideUpdateArgs>(args: Prisma.SelectSubset<T, ChannelPermissionOverrideUpdateArgs<ExtArgs>>): Prisma.Prisma__ChannelPermissionOverrideClient<runtime.Types.Result.GetResult<Prisma.$ChannelPermissionOverridePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more ChannelPermissionOverrides.
     * @param {ChannelPermissionOverrideDeleteManyArgs} args - Arguments to filter ChannelPermissionOverrides to delete.
     * @example
     * // Delete a few ChannelPermissionOverrides
     * const { count } = await prisma.channelPermissionOverride.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ChannelPermissionOverrideDeleteManyArgs>(args?: Prisma.SelectSubset<T, ChannelPermissionOverrideDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ChannelPermissionOverrides.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChannelPermissionOverrideUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChannelPermissionOverrides
     * const channelPermissionOverride = await prisma.channelPermissionOverride.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ChannelPermissionOverrideUpdateManyArgs>(args: Prisma.SelectSubset<T, ChannelPermissionOverrideUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ChannelPermissionOverrides and returns the data updated in the database.
     * @param {ChannelPermissionOverrideUpdateManyAndReturnArgs} args - Arguments to update many ChannelPermissionOverrides.
     * @example
     * // Update many ChannelPermissionOverrides
     * const channelPermissionOverride = await prisma.channelPermissionOverride.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ChannelPermissionOverrides and only return the `id`
     * const channelPermissionOverrideWithIdOnly = await prisma.channelPermissionOverride.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends ChannelPermissionOverrideUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ChannelPermissionOverrideUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChannelPermissionOverridePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one ChannelPermissionOverride.
     * @param {ChannelPermissionOverrideUpsertArgs} args - Arguments to update or create a ChannelPermissionOverride.
     * @example
     * // Update or create a ChannelPermissionOverride
     * const channelPermissionOverride = await prisma.channelPermissionOverride.upsert({
     *   create: {
     *     // ... data to create a ChannelPermissionOverride
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChannelPermissionOverride we want to update
     *   }
     * })
     */
    upsert<T extends ChannelPermissionOverrideUpsertArgs>(args: Prisma.SelectSubset<T, ChannelPermissionOverrideUpsertArgs<ExtArgs>>): Prisma.Prisma__ChannelPermissionOverrideClient<runtime.Types.Result.GetResult<Prisma.$ChannelPermissionOverridePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of ChannelPermissionOverrides.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChannelPermissionOverrideCountArgs} args - Arguments to filter ChannelPermissionOverrides to count.
     * @example
     * // Count the number of ChannelPermissionOverrides
     * const count = await prisma.channelPermissionOverride.count({
     *   where: {
     *     // ... the filter for the ChannelPermissionOverrides we want to count
     *   }
     * })
    **/
    count<T extends ChannelPermissionOverrideCountArgs>(args?: Prisma.Subset<T, ChannelPermissionOverrideCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ChannelPermissionOverrideCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a ChannelPermissionOverride.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChannelPermissionOverrideAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChannelPermissionOverrideAggregateArgs>(args: Prisma.Subset<T, ChannelPermissionOverrideAggregateArgs>): Prisma.PrismaPromise<GetChannelPermissionOverrideAggregateType<T>>;
    /**
     * Group by ChannelPermissionOverride.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChannelPermissionOverrideGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends ChannelPermissionOverrideGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ChannelPermissionOverrideGroupByArgs['orderBy'];
    } : {
        orderBy?: ChannelPermissionOverrideGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ChannelPermissionOverrideGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChannelPermissionOverrideGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ChannelPermissionOverride model
     */
    readonly fields: ChannelPermissionOverrideFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for ChannelPermissionOverride.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ChannelPermissionOverrideClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    channel<T extends Prisma.ChannelDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ChannelDefaultArgs<ExtArgs>>): Prisma.Prisma__ChannelClient<runtime.Types.Result.GetResult<Prisma.$ChannelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    role<T extends Prisma.RoleDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RoleDefaultArgs<ExtArgs>>): Prisma.Prisma__RoleClient<runtime.Types.Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the ChannelPermissionOverride model
 */
export interface ChannelPermissionOverrideFieldRefs {
    readonly id: Prisma.FieldRef<"ChannelPermissionOverride", 'String'>;
    readonly channelId: Prisma.FieldRef<"ChannelPermissionOverride", 'String'>;
    readonly roleId: Prisma.FieldRef<"ChannelPermissionOverride", 'String'>;
    readonly allowBitmask: Prisma.FieldRef<"ChannelPermissionOverride", 'BigInt'>;
    readonly denyBitmask: Prisma.FieldRef<"ChannelPermissionOverride", 'BigInt'>;
    readonly createdAt: Prisma.FieldRef<"ChannelPermissionOverride", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"ChannelPermissionOverride", 'DateTime'>;
}
/**
 * ChannelPermissionOverride findUnique
 */
export type ChannelPermissionOverrideFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelPermissionOverride
     */
    select?: Prisma.ChannelPermissionOverrideSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ChannelPermissionOverride
     */
    omit?: Prisma.ChannelPermissionOverrideOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ChannelPermissionOverrideInclude<ExtArgs> | null;
    /**
     * Filter, which ChannelPermissionOverride to fetch.
     */
    where: Prisma.ChannelPermissionOverrideWhereUniqueInput;
};
/**
 * ChannelPermissionOverride findUniqueOrThrow
 */
export type ChannelPermissionOverrideFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelPermissionOverride
     */
    select?: Prisma.ChannelPermissionOverrideSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ChannelPermissionOverride
     */
    omit?: Prisma.ChannelPermissionOverrideOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ChannelPermissionOverrideInclude<ExtArgs> | null;
    /**
     * Filter, which ChannelPermissionOverride to fetch.
     */
    where: Prisma.ChannelPermissionOverrideWhereUniqueInput;
};
/**
 * ChannelPermissionOverride findFirst
 */
export type ChannelPermissionOverrideFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelPermissionOverride
     */
    select?: Prisma.ChannelPermissionOverrideSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ChannelPermissionOverride
     */
    omit?: Prisma.ChannelPermissionOverrideOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ChannelPermissionOverrideInclude<ExtArgs> | null;
    /**
     * Filter, which ChannelPermissionOverride to fetch.
     */
    where?: Prisma.ChannelPermissionOverrideWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ChannelPermissionOverrides to fetch.
     */
    orderBy?: Prisma.ChannelPermissionOverrideOrderByWithRelationInput | Prisma.ChannelPermissionOverrideOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ChannelPermissionOverrides.
     */
    cursor?: Prisma.ChannelPermissionOverrideWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ChannelPermissionOverrides from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ChannelPermissionOverrides.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ChannelPermissionOverrides.
     */
    distinct?: Prisma.ChannelPermissionOverrideScalarFieldEnum | Prisma.ChannelPermissionOverrideScalarFieldEnum[];
};
/**
 * ChannelPermissionOverride findFirstOrThrow
 */
export type ChannelPermissionOverrideFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelPermissionOverride
     */
    select?: Prisma.ChannelPermissionOverrideSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ChannelPermissionOverride
     */
    omit?: Prisma.ChannelPermissionOverrideOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ChannelPermissionOverrideInclude<ExtArgs> | null;
    /**
     * Filter, which ChannelPermissionOverride to fetch.
     */
    where?: Prisma.ChannelPermissionOverrideWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ChannelPermissionOverrides to fetch.
     */
    orderBy?: Prisma.ChannelPermissionOverrideOrderByWithRelationInput | Prisma.ChannelPermissionOverrideOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ChannelPermissionOverrides.
     */
    cursor?: Prisma.ChannelPermissionOverrideWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ChannelPermissionOverrides from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ChannelPermissionOverrides.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ChannelPermissionOverrides.
     */
    distinct?: Prisma.ChannelPermissionOverrideScalarFieldEnum | Prisma.ChannelPermissionOverrideScalarFieldEnum[];
};
/**
 * ChannelPermissionOverride findMany
 */
export type ChannelPermissionOverrideFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelPermissionOverride
     */
    select?: Prisma.ChannelPermissionOverrideSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ChannelPermissionOverride
     */
    omit?: Prisma.ChannelPermissionOverrideOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ChannelPermissionOverrideInclude<ExtArgs> | null;
    /**
     * Filter, which ChannelPermissionOverrides to fetch.
     */
    where?: Prisma.ChannelPermissionOverrideWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ChannelPermissionOverrides to fetch.
     */
    orderBy?: Prisma.ChannelPermissionOverrideOrderByWithRelationInput | Prisma.ChannelPermissionOverrideOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ChannelPermissionOverrides.
     */
    cursor?: Prisma.ChannelPermissionOverrideWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ChannelPermissionOverrides from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ChannelPermissionOverrides.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ChannelPermissionOverrides.
     */
    distinct?: Prisma.ChannelPermissionOverrideScalarFieldEnum | Prisma.ChannelPermissionOverrideScalarFieldEnum[];
};
/**
 * ChannelPermissionOverride create
 */
export type ChannelPermissionOverrideCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelPermissionOverride
     */
    select?: Prisma.ChannelPermissionOverrideSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ChannelPermissionOverride
     */
    omit?: Prisma.ChannelPermissionOverrideOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ChannelPermissionOverrideInclude<ExtArgs> | null;
    /**
     * The data needed to create a ChannelPermissionOverride.
     */
    data: Prisma.XOR<Prisma.ChannelPermissionOverrideCreateInput, Prisma.ChannelPermissionOverrideUncheckedCreateInput>;
};
/**
 * ChannelPermissionOverride createMany
 */
export type ChannelPermissionOverrideCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChannelPermissionOverrides.
     */
    data: Prisma.ChannelPermissionOverrideCreateManyInput | Prisma.ChannelPermissionOverrideCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * ChannelPermissionOverride createManyAndReturn
 */
export type ChannelPermissionOverrideCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelPermissionOverride
     */
    select?: Prisma.ChannelPermissionOverrideSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ChannelPermissionOverride
     */
    omit?: Prisma.ChannelPermissionOverrideOmit<ExtArgs> | null;
    /**
     * The data used to create many ChannelPermissionOverrides.
     */
    data: Prisma.ChannelPermissionOverrideCreateManyInput | Prisma.ChannelPermissionOverrideCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ChannelPermissionOverrideIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * ChannelPermissionOverride update
 */
export type ChannelPermissionOverrideUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelPermissionOverride
     */
    select?: Prisma.ChannelPermissionOverrideSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ChannelPermissionOverride
     */
    omit?: Prisma.ChannelPermissionOverrideOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ChannelPermissionOverrideInclude<ExtArgs> | null;
    /**
     * The data needed to update a ChannelPermissionOverride.
     */
    data: Prisma.XOR<Prisma.ChannelPermissionOverrideUpdateInput, Prisma.ChannelPermissionOverrideUncheckedUpdateInput>;
    /**
     * Choose, which ChannelPermissionOverride to update.
     */
    where: Prisma.ChannelPermissionOverrideWhereUniqueInput;
};
/**
 * ChannelPermissionOverride updateMany
 */
export type ChannelPermissionOverrideUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update ChannelPermissionOverrides.
     */
    data: Prisma.XOR<Prisma.ChannelPermissionOverrideUpdateManyMutationInput, Prisma.ChannelPermissionOverrideUncheckedUpdateManyInput>;
    /**
     * Filter which ChannelPermissionOverrides to update
     */
    where?: Prisma.ChannelPermissionOverrideWhereInput;
    /**
     * Limit how many ChannelPermissionOverrides to update.
     */
    limit?: number;
};
/**
 * ChannelPermissionOverride updateManyAndReturn
 */
export type ChannelPermissionOverrideUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelPermissionOverride
     */
    select?: Prisma.ChannelPermissionOverrideSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ChannelPermissionOverride
     */
    omit?: Prisma.ChannelPermissionOverrideOmit<ExtArgs> | null;
    /**
     * The data used to update ChannelPermissionOverrides.
     */
    data: Prisma.XOR<Prisma.ChannelPermissionOverrideUpdateManyMutationInput, Prisma.ChannelPermissionOverrideUncheckedUpdateManyInput>;
    /**
     * Filter which ChannelPermissionOverrides to update
     */
    where?: Prisma.ChannelPermissionOverrideWhereInput;
    /**
     * Limit how many ChannelPermissionOverrides to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ChannelPermissionOverrideIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * ChannelPermissionOverride upsert
 */
export type ChannelPermissionOverrideUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelPermissionOverride
     */
    select?: Prisma.ChannelPermissionOverrideSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ChannelPermissionOverride
     */
    omit?: Prisma.ChannelPermissionOverrideOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ChannelPermissionOverrideInclude<ExtArgs> | null;
    /**
     * The filter to search for the ChannelPermissionOverride to update in case it exists.
     */
    where: Prisma.ChannelPermissionOverrideWhereUniqueInput;
    /**
     * In case the ChannelPermissionOverride found by the `where` argument doesn't exist, create a new ChannelPermissionOverride with this data.
     */
    create: Prisma.XOR<Prisma.ChannelPermissionOverrideCreateInput, Prisma.ChannelPermissionOverrideUncheckedCreateInput>;
    /**
     * In case the ChannelPermissionOverride was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.ChannelPermissionOverrideUpdateInput, Prisma.ChannelPermissionOverrideUncheckedUpdateInput>;
};
/**
 * ChannelPermissionOverride delete
 */
export type ChannelPermissionOverrideDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelPermissionOverride
     */
    select?: Prisma.ChannelPermissionOverrideSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ChannelPermissionOverride
     */
    omit?: Prisma.ChannelPermissionOverrideOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ChannelPermissionOverrideInclude<ExtArgs> | null;
    /**
     * Filter which ChannelPermissionOverride to delete.
     */
    where: Prisma.ChannelPermissionOverrideWhereUniqueInput;
};
/**
 * ChannelPermissionOverride deleteMany
 */
export type ChannelPermissionOverrideDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ChannelPermissionOverrides to delete
     */
    where?: Prisma.ChannelPermissionOverrideWhereInput;
    /**
     * Limit how many ChannelPermissionOverrides to delete.
     */
    limit?: number;
};
/**
 * ChannelPermissionOverride without action
 */
export type ChannelPermissionOverrideDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelPermissionOverride
     */
    select?: Prisma.ChannelPermissionOverrideSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ChannelPermissionOverride
     */
    omit?: Prisma.ChannelPermissionOverrideOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ChannelPermissionOverrideInclude<ExtArgs> | null;
};
//# sourceMappingURL=ChannelPermissionOverride.d.ts.map