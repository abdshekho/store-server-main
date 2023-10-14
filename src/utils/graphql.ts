const getFields = <T>(
    info: any,
    fields: T[]
): { activeFields: T[]; relationFields: T[] } => {
    const activeFields: T[] = [];
    const relationFields: T[] = [];

    const selectedFields: T[] = info.fieldNodes[0].selectionSet.selections.map(
        (s: any) => s.name.value
    );

    selectedFields.forEach((field) => {
        if (fields.includes(field)) return relationFields.push(field);
        else if ((field as any) === "__typename") return;
        activeFields.push(field);
    })

    return { activeFields, relationFields };
};

export default { getFields };
