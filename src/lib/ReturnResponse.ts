const ReturnResponse = (
    success: boolean,
    message: string,
    status: number
): Response => {
    return Response.json({ success, message }, { status });
};

export default ReturnResponse