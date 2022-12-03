#-----------------------------------------------------------------------------
# Copyright (c) 2012 - 2022, Anaconda, Inc., and Bokeh Contributors.
# All rights reserved.
#
# The full license is in the file LICENSE.txt, distributed with this software.
#-----------------------------------------------------------------------------
"""

"""

#-----------------------------------------------------------------------------
# Boilerplate
#-----------------------------------------------------------------------------
from __future__ import annotations

import logging # isort:skip
log = logging.getLogger(__name__)

#-----------------------------------------------------------------------------
# Imports
#-----------------------------------------------------------------------------

# Standard library imports
from typing import Generic, TypeVar

# Bokeh imports
from .coordinates import CoordinatesProvider, Node

#-----------------------------------------------------------------------------
# Globals and constants
#-----------------------------------------------------------------------------

__all__ = (
)

#-----------------------------------------------------------------------------
# General API
#-----------------------------------------------------------------------------

class Nodes:

    target: CoordinatesProvider

    def __init__(self, target: CoordinatesProvider) -> None:
        self.target = target

    def __repr__(self) -> str:
        return f"Nodes(target={self.target})"

    __str__ = __repr__

class NodeDef:

    _term: str
    _node: Node | None

    def __init__(self) -> None:
        self._node = None

    def __set_name__(self, obj: type[Nodes], name: str) -> None:
        self._term = name

    def __get__(self, obj: Nodes, type: type[Nodes] | None = None) -> Node:
        if self._node is None:
            self._node = Node(target=obj.target, term=self._term)
        return self._node

T = TypeVar("T", bound=Nodes)

class NodesDef(Generic[T]):

    _cls: type[T]
    _nodes: T | None

    def __init__(self, cls: type[T]) -> None:
        self._cls = cls
        self._nodes = None

    def __get__(self, obj: CoordinatesProvider, type: type[CoordinatesProvider] | None = None) -> T:
        if self._nodes is None:
            self._nodes = self._cls(obj)
        return self._nodes

#-----------------------------------------------------------------------------
# Dev API
#-----------------------------------------------------------------------------

#-----------------------------------------------------------------------------
# Private API
#-----------------------------------------------------------------------------

#-----------------------------------------------------------------------------
# Code
#-----------------------------------------------------------------------------
