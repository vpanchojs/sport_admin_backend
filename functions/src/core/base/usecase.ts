export interface UseCase<E, S> {

    execute(param: E): Promise<S>

}