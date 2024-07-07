export interface UseCase<T, V> {
  execute(dto: T): V | Promise<V>;
}
