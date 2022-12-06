import {expect} from "assertions"

import {toposort} from "@bokehjs/core/util/graph"

describe("core/util/graph", () => {

  it("should support toposort()", () => {
    const graph = new Map([
      [5, []],
      [7, []],
      [3, []],
      [1, [5, 7]],
      [8, [7, 3]],
      [2, [1]],
      [9, [1, 8]],
      [6, [1, 3]],
    ])

    expect(toposort(graph)).to.be.equal([3, 7, 8, 5, 1, 6, 9, 2])
  })
})
