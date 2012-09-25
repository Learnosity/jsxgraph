/*
    Copyright 2012
        Matthias Ehmann,
        Michael Gerhaeuser,
        Carsten Miller,
        Alfred Wassermann

    This file is part of JSXGraph.

    JSXGraph is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    JSXGraph is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with JSXGraph.  If not, see <http://www.gnu.org/licenses/>.
*/

JXG.extend(JXG.Board.prototype, /** @lends JXG.Board.prototype */ {
    intersection: function(el1,el2,i,j){ 
        el1 = JXG.getReference(this,el1);
        el2 = JXG.getReference(this,el2);
        
        // curve - curve, but not both are arcs TEMPORARY FIX!!!
        if (el1.elementClass==JXG.OBJECT_CLASS_CURVE 
            && el2.elementClass==JXG.OBJECT_CLASS_CURVE
            && (el1.type!=JXG.OBJECT_TYPE_ARC || el2.type!=JXG.OBJECT_TYPE_ARC) ) {
            return function(){return JXG.Math.Geometry.meetCurveCurve(el1,el2,i,j,el1.board); };
        // arc - line   (arcs are of class curve, but are intersected like circles)
        } else if ((el1.type==JXG.OBJECT_TYPE_ARC && el2.elementClass==JXG.OBJECT_CLASS_LINE) ||
                   (el2.type==JXG.OBJECT_TYPE_ARC && el1.elementClass==JXG.OBJECT_CLASS_LINE)) {
            return function(){return JXG.Math.Geometry.meet(el1.stdform,el2.stdform,i,el1.board); };
        // curve - line (this includes intersections between conic sections and lines
        } else if ((el1.elementClass==JXG.OBJECT_CLASS_CURVE && el2.elementClass==JXG.OBJECT_CLASS_LINE)||
                   (el2.elementClass==JXG.OBJECT_CLASS_CURVE && el1.elementClass==JXG.OBJECT_CLASS_LINE)) {
            return function(){return JXG.Math.Geometry.meetCurveLine(el1,el2,i,el1.board); };
        // segment - segment
        } else if (el1.elementClass==JXG.OBJECT_CLASS_LINE && el2.elementClass==JXG.OBJECT_CLASS_LINE
                   && el1.visProp.straightfirst==false && el1.visProp.straightlast==false 
                   && el2.visProp.straightfirst==false && el2.visProp.straightlast==false) {
            return function(){  
                if (JXG.exists(this.point) && this.point.visProp.alwaysintersect) {
                    return JXG.Math.Geometry.meet(el1.stdform,el2.stdform,i,el1.board);
                } else {
                    return JXG.Math.Geometry.meetSegmentSegment(
                        el1.point1.coords.usrCoords, el1.point2.coords.usrCoords,
                        el2.point1.coords.usrCoords, el2.point2.coords.usrCoords, 
                        el1.board); 
                }
            };
        // All other combinations of circles and lines
        } else {
            return function(){return JXG.Math.Geometry.meet(el1.stdform,el2.stdform,i,el1.board); };
        }
    }, //returns a single point of intersection
    intersectionFunc: function(el1,el2,i,j){ return this.intersection(el1,el2,i,j); },

    /**
    * Intersection of circles and line
    */ 
    otherIntersection: function(el1,el2,el){ 
        el1 = JXG.getReference(this,el1);
        el2 = JXG.getReference(this,el2);
        return function(){
            var c = JXG.Math.Geometry.meet(el1.stdform,el2.stdform,0,el1.board);
            if (Math.abs(el.X()-c.usrCoords[1])>JXG.Math.eps ||
                Math.abs(el.Y()-c.usrCoords[2])>JXG.Math.eps ||
                Math.abs(el.Z()-c.usrCoords[0])>JXG.Math.eps) {
                return c;
            } else {
                return JXG.Math.Geometry.meet(el1.stdform,el2.stdform,1,el1.board);
            }
        };
    }, //returns a single point of intersection
});