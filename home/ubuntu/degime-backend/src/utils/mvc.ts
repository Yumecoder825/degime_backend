type IoCallbackFn<T> = (data: T) => void
type RequestHandlerWithIOFn<T, Q, R, N> = (req: Q, res: R, next: N, ioFn: IoCallbackFn<T>) => void;

export function withIOFn<T, Q, R, N> (controller: RequestHandlerWithIOFn<T, Q, R, N>, ioFn: IoCallbackFn<T>) {
    return (req: Q, res: R, next: N) => controller(req, res, next, ioFn)
};
