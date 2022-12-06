export type Graph<T> = Map<T, T[]>

enum Status { Temporary, Permanent }
type State<T> = Map<T, Status>

export function toposort<T>(graph: Graph<T>): T[] {
  const result: T[] = []
  const state: State<T> = new Map()
  const rev_map: Graph<T> = new Map()

  for (const node of graph.keys()) {
    rev_map.set(node, [])
  }
  for (const [node, deps] of graph.entries()) {
    for (const dep of deps) {
      const rev_deps = rev_map.get(dep)!
      rev_deps.push(node)
    }
  }

  for (const node of graph.keys()) {
    if (state.get(node) == null)
      visit(node)
  }

  function visit(node: T): void {
    const status = state.get(node)

    if (status == Status.Permanent)
      return
    if (status == Status.Temporary)
      throw new Error("cycle detected")

    state.set(node, Status.Temporary)

    // for each node m with an edge from n to m do
    for (const m of rev_map.get(node)!) {
      visit(m)
    }

    state.set(node, Status.Permanent)
    result.unshift(node)
  }

  return result
}
