const returnResponse = (
    success: boolean,
    message: string,
    status: number,
    data?: unknown,
): Response => {
    return Response.json({ success, message, ...(data !== undefined && { data }) }, { status });
};

export default returnResponse