import {
  CommonModule
} from "./chunk-Z6WHAJ56.js";
import {
  DOCUMENT,
  isPlatformBrowser
} from "./chunk-YXCMCNAI.js";
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  DestroyRef,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  Input,
  NgModule,
  NgZone,
  Output,
  PLATFORM_ID,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  afterNextRender,
  booleanAttribute,
  computed,
  contentChild,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  model,
  numberAttribute,
  output,
  runInInjectionContext,
  setClassMetadata,
  signal,
  untracked,
  viewChild,
  ɵɵInheritDefinitionFeature,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵcontentQuerySignal,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵqueryAdvance,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵviewQuerySignal
} from "./chunk-R4BFVPHT.js";
import {
  __async,
  __decorate,
  __spreadProps,
  __spreadValues
} from "./chunk-X5V6L67X.js";

// node_modules/@foblex/2d/fesm2015/foblex-2d.js
var Arc = class {
  constructor(center, radiusX, radiusY, startAngle, endAngle) {
    this.center = center;
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
  }
};
var PointExtensions = class _PointExtensions {
  static castToPoint(value) {
    return value || _PointExtensions.initialize();
  }
  static initialize(x = 0, y = 0) {
    return {
      x,
      y
    };
  }
  static copy(point) {
    return _PointExtensions.initialize(point.x, point.y);
  }
  static isEqual(point1, point2) {
    return point1.x === point2.x && point1.y === point2.y;
  }
  static sum(point1, point2) {
    return {
      x: point1.x + point2.x,
      y: point1.y + point2.y
    };
  }
  static sub(point1, point2) {
    return {
      x: point1.x - point2.x,
      y: point1.y - point2.y
    };
  }
  static div(point, value) {
    return {
      x: point.x / value,
      y: point.y / value
    };
  }
  static mult(point, value) {
    return {
      x: point.x * value,
      y: point.y * value
    };
  }
  static interpolatePoints(point1, point2, t) {
    const oneMinusT = 1 - t;
    return _PointExtensions.initialize(point1.x * oneMinusT + point2.x * t, point1.y * oneMinusT + point2.y * t);
  }
  static roundTo(point, size) {
    const xCount = Math.trunc(point.x / size);
    const yCount = Math.trunc(point.y / size);
    return {
      x: xCount * size,
      y: yCount * size
    };
  }
  static hypotenuse(point1, point2) {
    const a = point2.x - point1.x;
    const b = point2.y - point1.y;
    return Math.abs(Math.sqrt(a * a + b * b));
  }
  static distance(point1, point2) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  static getMinimum(point1, point2) {
    return _PointExtensions.initialize(Math.min(point1.x, point2.x), Math.min(point1.y, point2.y));
  }
  static getMaximum(point1, point2) {
    return _PointExtensions.initialize(Math.max(point1.x, point2.x), Math.max(point1.y, point2.y));
  }
  static matrixTransform(point, element) {
    let result = _PointExtensions.initialize(point.x, point.y);
    let matrix = element.getScreenCTM();
    if (matrix) {
      const svgPoint = element.createSVGPoint();
      svgPoint.x = point.x;
      svgPoint.y = point.y;
      result = svgPoint.matrixTransform(matrix.inverse());
    }
    return result;
  }
  static elementTransform(point, element) {
    let result = _PointExtensions.initialize(point.x, point.y);
    let matrix = element.getBoundingClientRect();
    result = _PointExtensions.sub(result, _PointExtensions.initialize(matrix.left, matrix.top));
    return result;
  }
};
var Point = class _Point {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  static fromPoint(point) {
    return new _Point(point.x, point.y);
  }
  add(point) {
    const result = PointExtensions.sum(this, point);
    return _Point.fromPoint(result);
  }
  sub(point) {
    const result = PointExtensions.sub(this, point);
    return _Point.fromPoint(result);
  }
  subNumber(value) {
    const result = PointExtensions.sub(this, new _Point(value, value));
    return _Point.fromPoint(result);
  }
  div(value) {
    const result = PointExtensions.div(this, value);
    return _Point.fromPoint(result);
  }
  mult(value) {
    const result = PointExtensions.mult(this, value);
    return _Point.fromPoint(result);
  }
  matrixTransform(element) {
    const result = PointExtensions.matrixTransform(this, element);
    return _Point.fromPoint(result);
  }
  elementTransform(element) {
    const result = PointExtensions.elementTransform(this, element);
    return _Point.fromPoint(result);
  }
};
var LineExtensions = class {
  static initialize(point1 = PointExtensions.initialize(), point2 = PointExtensions.initialize()) {
    return {
      point1,
      point2
    };
  }
  static copy(line) {
    return {
      point1: line.point1,
      point2: line.point2
    };
  }
  static hypotenuse(line) {
    return Math.sqrt(Math.pow(line.point1.x - line.point2.x, 2) + Math.pow(line.point1.y - line.point2.y, 2));
  }
};
var Line = class {
  constructor(point1, point2) {
    this.point1 = point1;
    this.point2 = point2;
  }
};
var RectExtensions = class _RectExtensions {
  static initialize(x = 0, y = 0, width = 0, height = 0) {
    if (width < 0) {
      x = x + width;
      width = -width;
    }
    if (height < 0) {
      y = y + height;
      height = -height;
    }
    const gravityCenter = PointExtensions.initialize(x + width / 2, y + height / 2);
    return {
      x,
      y,
      width,
      height,
      gravityCenter
    };
  }
  static copy(rect) {
    return _RectExtensions.initialize(rect.x, rect.y, rect.width, rect.height);
  }
  static fromElement(element) {
    const {
      x,
      y,
      width,
      height
    } = element.getBoundingClientRect();
    return _RectExtensions.initialize(x, y, width, height);
  }
  static isIncludePoint(rect, point) {
    return point.x >= _RectExtensions.left(rect) && point.x <= _RectExtensions.right(rect) && point.y >= _RectExtensions.top(rect) && point.y <= _RectExtensions.bottom(rect);
  }
  static intersectionWithRect(rect1, rect2) {
    return !(rect1.x + rect1.width < rect2.x || rect2.x + rect2.width < rect1.x || rect1.y + rect1.height < rect2.y || rect2.y + rect2.height < rect1.y);
  }
  static left(rect) {
    return rect.x;
  }
  static top(rect) {
    return rect.y;
  }
  static right(rect) {
    return rect.x + rect.width;
  }
  static bottom(rect) {
    return rect.y + rect.height;
  }
  static addPoint(rect, point) {
    const rectCopy = _RectExtensions.copy(rect);
    rectCopy.x += point.x;
    rectCopy.y += point.y;
    return this.initialize(rectCopy.x, rectCopy.y, rectCopy.width, rectCopy.height);
  }
  static mult(rect, value) {
    const rectCopy = _RectExtensions.copy(rect);
    rectCopy.x *= value;
    rectCopy.y *= value;
    rectCopy.width *= value;
    rectCopy.height *= value;
    return this.initialize(rectCopy.x, rectCopy.y, rectCopy.width, rectCopy.height);
  }
  static div(rect, value) {
    const rectCopy = _RectExtensions.copy(rect);
    rectCopy.x /= value;
    rectCopy.y /= value;
    rectCopy.width /= value;
    rectCopy.height /= value;
    return this.initialize(rectCopy.x, rectCopy.y, rectCopy.width, rectCopy.height);
  }
  static addPointToSize(rect, point) {
    const rectCopy = _RectExtensions.copy(rect);
    rectCopy.width += point.x;
    rectCopy.height += point.y;
    return this.initialize(rectCopy.x, rectCopy.y, rectCopy.width, rectCopy.height);
  }
  static union(rects) {
    if (!rects || rects.length === 0) {
      return null;
    }
    return rects.reduce((result, rect) => {
      const minX = Math.min(result.x, rect.x);
      const minY = Math.min(result.y, rect.y);
      const maxX = Math.max(result.x + result.width, rect.x + rect.width);
      const maxY = Math.max(result.y + result.height, rect.y + rect.height);
      return _RectExtensions.initialize(minX, minY, maxX - minX, maxY - minY);
    }, rects[0]);
  }
  static elementTransform(rect, element) {
    const matrix = element.getBoundingClientRect();
    const position = PointExtensions.sub(rect, PointExtensions.initialize(matrix.left, matrix.top));
    return _RectExtensions.initialize(position.x, position.y, rect.width, rect.height);
  }
  static updateIsNotFinite(rect) {
    if (!Number.isFinite(rect.width) || !Number.isFinite(rect.height) || !Number.isFinite(rect.x) || !Number.isFinite(rect.y)) {
      return _RectExtensions.initialize(0, 0, 0, 0);
    }
    return rect;
  }
};
function adjustRectToMinSize(rect, minSize) {
  const width = Math.max(rect.width, minSize);
  const height = Math.max(rect.height, minSize);
  const offsetX = (width - rect.width) / 2;
  const offsetY = (height - rect.height) / 2;
  return RectExtensions.initialize(rect.x - offsetX, rect.y - offsetY, width, height);
}
function setRectToElement(rect, element) {
  rect = RectExtensions.updateIsNotFinite(rect);
  element.setAttribute("x", rect.x.toString());
  element.setAttribute("y", rect.y.toString());
  element.setAttribute("width", rect.width.toString());
  element.setAttribute("height", rect.height.toString());
}
function setRectToViewBox(rect, element) {
  rect = RectExtensions.updateIsNotFinite(rect);
  element.setAttribute("viewBox", `${rect.x} ${rect.y} ${rect.width} ${rect.height}`);
}
var RoundedRect = class _RoundedRect {
  constructor(x = 0, y = 0, width = 0, height = 0, radius1 = 0, radius2 = 0, radius3 = 0, radius4 = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.radius1 = radius1;
    this.radius2 = radius2;
    this.radius3 = radius3;
    this.radius4 = radius4;
    this.gravityCenter = PointExtensions.initialize();
    this.gravityCenter = this.calculateGravityCenter(this);
  }
  calculateGravityCenter(rect) {
    return new Point(rect.x + rect.width / 2, rect.y + rect.height / 2);
  }
  static fromRect(rect) {
    return new _RoundedRect(rect.x, rect.y, rect.width, rect.height);
  }
  static fromRoundedRect(rect) {
    return new _RoundedRect(rect.x, rect.y, rect.width, rect.height, rect.radius1, rect.radius2, rect.radius3, rect.radius4);
  }
  static fromCenter(rect, width, height) {
    return new _RoundedRect(rect.gravityCenter.x - width / 2, rect.gravityCenter.y - height / 2, width, height, rect.radius1, rect.radius2, rect.radius3, rect.radius4);
  }
  static fromPoint(point) {
    return new _RoundedRect(point.x, point.y);
  }
  addPoint(point) {
    const copy = _RoundedRect.fromRoundedRect(this);
    copy.x += point.x;
    copy.y += point.y;
    copy.gravityCenter = this.calculateGravityCenter(copy);
    return copy;
  }
};
var SizeExtensions = class _SizeExtensions {
  static initialize(width = 0, height = 0) {
    return {
      width,
      height
    };
  }
  static isEqual(size1, size2) {
    return size1.width === size2.width && size1.height === size2.height;
  }
  static offsetFromElement(element) {
    if (element instanceof SVGGraphicsElement) {
      const bBox = element.getBBox();
      return _SizeExtensions.initialize(bBox.width, bBox.height);
    } else if (element instanceof HTMLElement) {
      return _SizeExtensions.initialize(element.offsetWidth, element.offsetHeight);
    }
    return void 0;
  }
};
function defaultTransformModel() {
  return {
    position: PointExtensions.initialize(),
    scaledPosition: PointExtensions.initialize(),
    scale: 1,
    rotate: 0
  };
}
function parseTransformModel(value) {
  let result;
  if (value) {
    value = value.replace("matrix(", "");
    value = value.replace(")", "");
    const values = value.split(" ");
    result = {
      position: {
        x: Number(values[4]),
        y: Number(values[5])
      },
      scaledPosition: PointExtensions.initialize(),
      scale: Number(values[0]),
      rotate: 0
    };
  }
  return result;
}
var TransformModelExtensions = class {
  static toString(transform) {
    const position = PointExtensions.sum(transform.position, transform.scaledPosition);
    return `matrix(${transform.scale}, 0, 0, ${transform.scale}, ${position.x}, ${position.y})`;
  }
  static fromString(value) {
    return parseTransformModel(value);
  }
  static default() {
    return defaultTransformModel();
  }
};
var VectorExtensions = class _VectorExtensions {
  static initialize(x = 0, y = 0) {
    return PointExtensions.initialize(x, y);
  }
  static fromPoints(p1, p2) {
    return _VectorExtensions.initialize(p2.x - p1.x, p2.y - p1.y);
  }
  static vectorLength(v) {
    return Math.sqrt(_VectorExtensions.magnitudeSquared(v));
  }
  static magnitudeSquared(v) {
    return v.x * v.x + v.y * v.y;
  }
  static dotProduct(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  }
  static crossProduct(v1, v2) {
    return v1.x * v2.y - v1.y * v2.x;
  }
  static subtract(v1, v2) {
    return _VectorExtensions.initialize(v1.x - v2.x, v1.y - v2.y);
  }
  static add(v1, v2) {
    return _VectorExtensions.initialize(v1.x + v2.x, v1.y + v2.y);
  }
  static scale(v, value) {
    return _VectorExtensions.initialize(v.x * value, v.y * value);
  }
  static angle(v1, v2) {
    const radians = Math.acos(Math.max(-1, Math.min(_VectorExtensions.dotProduct(v1, v2) / (_VectorExtensions.vectorLength(v1) * _VectorExtensions.vectorLength(v2)), 1)));
    return _VectorExtensions.crossProduct(v1, v2) < 0 ? -radians : radians;
  }
};
var ShapeParser = class {
  // public static getSegments(rect: IRoundedRect): (Arc | Line)[] {
  //   return this.parseRect(rect);
  // }
  /**
   * Parses the rounded rectangle into its constituent segments (arcs and lines).
   * @param rect - The rounded rectangle to parse.
   * @returns An array of arcs and lines representing the rectangle.
   */
  static parseRoundedRect(rect) {
    const degree90 = Math.PI * 0.5;
    const x0 = rect.x;
    const y0 = rect.y;
    const x1 = rect.x + rect.width;
    const y1 = rect.y + rect.height;
    const topLeftX = rect.x + rect.radius1;
    const topLeftY = rect.y + rect.radius1;
    const topRightX = rect.x + rect.width - rect.radius2;
    const topRightY = rect.y + rect.radius2;
    const bottomRightX = rect.x + rect.width - rect.radius3;
    const bottomRightY = rect.y + rect.height - rect.radius3;
    const bottomLeftX = rect.x + rect.radius4;
    const bottomLeftY = rect.y + rect.height - rect.radius4;
    return [new Arc({
      x: topLeftX,
      y: topLeftY
    }, rect.radius1, rect.radius1, 2 * degree90, 3 * degree90), new Line({
      x: topLeftX,
      y: y0
    }, {
      x: topRightX,
      y: y0
    }), new Arc({
      x: topRightX,
      y: topRightY
    }, rect.radius2, rect.radius2, 3 * degree90, 4 * degree90), new Line({
      x: x1,
      y: topRightY
    }, {
      x: x1,
      y: bottomRightY
    }), new Arc({
      x: bottomRightX,
      y: bottomRightY
    }, rect.radius3, rect.radius3, 0, degree90), new Line({
      x: bottomRightX,
      y: y1
    }, {
      x: bottomLeftX,
      y: y1
    }), new Arc({
      x: bottomLeftX,
      y: bottomLeftY
    }, rect.radius4, rect.radius4, degree90, 2 * degree90), new Line({
      x: x0,
      y: bottomLeftY
    }, {
      x: x0,
      y: topLeftY
    })];
  }
};
var GetIntersections = class {
  /**
   * Finds the guaranteed intersection points between a line segment and a rounded rectangle.
   * @param from - Starting point of the line segment.
   * @param to - Ending point of the line segment.
   * @param rect - The rect to check for intersections.
   * @returns An array of intersection points.
   */
  static getRoundedRectIntersections(from, to, rect) {
    const segments = ShapeParser.parseRoundedRect(rect);
    for (const segment of segments) {
      if (segment instanceof Arc) {
        const intersections = this.intersectArcWithLine(segment, from, to);
        if (intersections.length > 0) {
          return intersections;
        }
      } else if (segment instanceof Line) {
        const intersection = this.intersectLineSegments(from, to, segment.point1, segment.point2);
        if (intersection) {
          return [intersection];
        }
      }
    }
    return [];
  }
  /**
   * Finds the intersection points between a line segment and an SVG path.
   * @param path - The SVG path to check for intersections.
   * @param rect - The rect to check for intersections.
   * @returns An array of intersection points.
   */
  static getRoundedRectIntersectionsWithSVGPath(path, rect) {
    const pathLength = path.getTotalLength();
    const points = [];
    for (let i = 0; i <= pathLength; i += 1) {
      const point = path.getPointAtLength(i);
      points.push({
        x: point.x,
        y: point.y
      });
    }
    for (let i = 1; i < points.length; i++) {
      const intersections = this.getRoundedRectIntersections(points[i - 1], points[i], rect);
      if (intersections.length > 0) {
        return intersections;
      }
    }
    return [];
  }
  /**
   * Finds the intersection points between an arc and a line segment.
   * @param arc - The arc to check for intersections.
   * @param from - Starting point of the line segment.
   * @param to - Ending point of the line segment.
   * @returns An array of intersection points.
   */
  static intersectArcWithLine(arc, from, to) {
    return this.filterPointsWithinArc(this.findEllipseLineIntersections(arc.center, arc.radiusX, arc.radiusY, from, to), arc);
  }
  /**
   * Finds the intersection point between two line segments.
   * @param p1 - Starting point of the first line segment.
   * @param p2 - Ending point of the first line segment.
   * @param p3 - Starting point of the second line segment.
   * @param p4 - Ending point of the second line segment.
   * @returns The intersection point or null if there is no intersection.
   */
  static intersectLineSegments(p1, p2, p3, p4) {
    const s1_x = p2.x - p1.x;
    const s1_y = p2.y - p1.y;
    const s2_x = p4.x - p3.x;
    const s2_y = p4.y - p3.y;
    const s = (-s1_y * (p1.x - p3.x) + s1_x * (p1.y - p3.y)) / (-s2_x * s1_y + s1_x * s2_y);
    const t = (s2_x * (p1.y - p3.y) - s2_y * (p1.x - p3.x)) / (-s2_x * s1_y + s1_x * s2_y);
    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      return {
        x: p1.x + t * s1_x,
        y: p1.y + t * s1_y
      };
    }
    return null;
  }
  /**
   * Filters intersection points to retain only those within the given arc.
   * @param points - The points to filter.
   * @param arc - The arc to check against.
   * @returns An array of points within the arc.
   */
  static filterPointsWithinArc(points, arc) {
    let {
      center,
      startAngle,
      endAngle
    } = arc;
    if (points.length === 0) {
      return points;
    }
    if (endAngle < startAngle) {
      [startAngle, endAngle] = [endAngle, startAngle];
    }
    if (startAngle < 0 || endAngle < 0) {
      startAngle += 2 * Math.PI;
      endAngle += 2 * Math.PI;
    }
    const filteredPoints = [];
    for (const point of points) {
      let angle = this.normalizeAngle(VectorExtensions.angle(VectorExtensions.initialize(1, 0), VectorExtensions.initialize(point.x - center.x, point.y - center.y)));
      if (angle < startAngle) {
        angle += 2 * Math.PI;
      }
      if (startAngle <= angle && angle <= endAngle) {
        filteredPoints.push(point);
      }
    }
    return filteredPoints;
  }
  /**
   * Normalizes an angle to be within the range 0 to 2π.
   * @param radians - The angle in radians.
   * @returns The normalized angle.
   */
  static normalizeAngle(radians) {
    const normal = radians % (2 * Math.PI);
    return normal < 0 ? normal + 2 * Math.PI : normal;
  }
  /**
   * Finds the intersection points between an ellipse and a line segment.
   * @param center - Center of the ellipse.
   * @param radiusX - X radius of the ellipse.
   * @param radiusY - Y radius of the ellipse.
   * @param pointA - Starting point of the line segment.
   * @param pointB - Ending point of the line segment.
   * @returns An array of intersection points.
   */
  static findEllipseLineIntersections(center, radiusX, radiusY, pointA, pointB) {
    const origin = VectorExtensions.initialize(pointA.x, pointA.y);
    const direction = VectorExtensions.fromPoints(pointA, pointB);
    const ellipseCenter = VectorExtensions.initialize(center.x, center.y);
    const diff = VectorExtensions.subtract(origin, ellipseCenter);
    const scaledDir = VectorExtensions.initialize(direction.x / (radiusX * radiusX), direction.y / (radiusY * radiusY));
    const scaledDiff = VectorExtensions.initialize(diff.x / (radiusX * radiusX), diff.y / (radiusY * radiusY));
    const a = VectorExtensions.dotProduct(direction, scaledDir);
    const b = VectorExtensions.dotProduct(direction, scaledDiff);
    const c = VectorExtensions.dotProduct(diff, scaledDiff) - 1;
    const discriminant = b * b - a * c;
    return discriminant < 0 ? [] : this.calculateIntersectionPoints(discriminant, a, b, pointA, pointB);
  }
  /**
   * Calculates the intersection points based on the discriminant.
   * @param discriminant - The discriminant value.
   * @param a - Coefficient 'a' in the quadratic equation.
   * @param b - Coefficient 'b' in the quadratic equation.
   * @param pointA - Starting point of the line segment.
   * @param pointB - Ending point of the line segment.
   * @returns An array of intersection points.
   */
  static calculateIntersectionPoints(discriminant, a, b, pointA, pointB) {
    const points = [];
    if (discriminant > 0) {
      const root = Math.sqrt(discriminant);
      const t1 = (-b - root) / a;
      const t2 = (-b + root) / a;
      if (t1 >= 0 && t1 <= 1) {
        points.push(PointExtensions.interpolatePoints(pointA, pointB, t1));
      }
      if (t2 >= 0 && t2 <= 1) {
        points.push(PointExtensions.interpolatePoints(pointA, pointB, t2));
      }
    } else {
      const t = -b / a;
      if (t >= 0 && t <= 1) {
        points.push(PointExtensions.interpolatePoints(pointA, pointB, t));
      }
    }
    return points;
  }
};

// node_modules/@foblex/mediator/fesm2015/foblex-mediator.js
var Pipeline = class {
  handle(request, injector) {
    let isValid = true;
    if (this.validator) {
      isValid = injector.get(this.validator).handle(request);
    }
    if (!isValid) {
      return;
    }
    return injector.get(this.execution).handle(request);
  }
  execute(request, injector) {
    return injector.get(this.execution).handle(request);
  }
  setValidator(validator) {
    this.validator = validator;
  }
  setExecution(execution) {
    this.execution = execution;
  }
};
var FMediator = class _FMediator {
  constructor() {
    this._injector = inject(Injector);
  }
  static registerPipeline(type, handler, isValidator) {
    if (!type || !type.fToken) {
      throw new Error("Type must have a fToken static property.");
    }
    const pipeline = this.pipelines.get(type.fToken) || new Pipeline();
    isValidator ? pipeline.setValidator(handler) : pipeline.setExecution(handler);
    this.pipelines.set(type.fToken, pipeline);
  }
  send(request) {
    const pipeline = _FMediator.pipelines.get(request.constructor.fToken);
    if (pipeline) {
      return pipeline.handle(request, this._injector);
    }
    throw new Error("Handler not registered for request type.");
  }
  // run pipeline without validation and error handling
  execute(request) {
    return _FMediator.pipelines.get(request.constructor.fToken).execute(request, this._injector);
  }
};
FMediator.pipelines = /* @__PURE__ */ new Map();
FMediator.ɵfac = function FMediator_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || FMediator)();
};
FMediator.ɵprov = ɵɵdefineInjectable({
  token: FMediator,
  factory: FMediator.ɵfac
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FMediator, [{
    type: Injectable
  }], null, null);
})();
function FExecutionRegister(requestType) {
  return function(constructor) {
    FMediator.registerPipeline(requestType, constructor, false);
  };
}

// node_modules/@foblex/platform/fesm2022/foblex-platform.mjs
var BrowserLocalStorageService = class _BrowserLocalStorageService {
  setItem(key, value) {
    localStorage.setItem(key, value);
  }
  getItem(key) {
    return localStorage.getItem(key);
  }
  removeItem(key) {
    localStorage.removeItem(key);
  }
  clear() {
    localStorage.clear();
  }
  static ɵfac = function BrowserLocalStorageService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrowserLocalStorageService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _BrowserLocalStorageService,
    factory: _BrowserLocalStorageService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrowserLocalStorageService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var ServerLocalStorageService = class _ServerLocalStorageService {
  storage = {};
  setItem(key, value) {
    this.storage[key] = value;
  }
  getItem(key) {
    return this.storage[key] || null;
  }
  removeItem(key) {
    delete this.storage[key];
  }
  clear() {
    this.storage = {};
  }
  static ɵfac = function ServerLocalStorageService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ServerLocalStorageService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ServerLocalStorageService,
    factory: _ServerLocalStorageService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ServerLocalStorageService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var F_LOCAL_STORAGE = new InjectionToken("F_LOCAL_STORAGE", {
  providedIn: "root",
  factory: () => {
    return isPlatformBrowser(inject(PLATFORM_ID)) ? inject(BrowserLocalStorageService) : inject(ServerLocalStorageService);
  }
});
var BrowserWindowService = class _BrowserWindowService {
  getComputedStyle(element) {
    return window.getComputedStyle(element);
  }
  get innerWidth() {
    return window.innerWidth;
  }
  get innerHeight() {
    return window.innerHeight;
  }
  get pageXOffset() {
    return window.pageXOffset;
  }
  get pageYOffset() {
    return window.pageYOffset;
  }
  isMediaQuery(query) {
    return window.matchMedia(query).matches;
  }
  requestAnimationFrame(callback) {
    return window.requestAnimationFrame(callback);
  }
  get location() {
    return window.location;
  }
  open(url, target, features) {
    window.open(url, target, features);
  }
  static ɵfac = function BrowserWindowService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrowserWindowService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _BrowserWindowService,
    factory: _BrowserWindowService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrowserWindowService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var ServerWindowService = class _ServerWindowService {
  getComputedStyle(element) {
    return new Proxy({
      getPropertyValue: (property) => {
        return "0";
      }
    }, {
      get: (target, prop) => {
        if (prop === "getPropertyValue") {
          return target.getPropertyValue;
        }
        return "0";
      }
    });
  }
  get innerWidth() {
    return 0;
  }
  get innerHeight() {
    return 0;
  }
  get pageXOffset() {
    return 0;
  }
  get pageYOffset() {
    return 0;
  }
  isMediaQuery(query) {
    return false;
  }
  requestAnimationFrame(callback) {
    return setTimeout(callback, 0);
  }
  get location() {
    return {
      href: "",
      pathname: "",
      search: "",
      hash: "",
      origin: ""
    };
  }
  open(url, target, features) {
  }
  static ɵfac = function ServerWindowService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ServerWindowService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ServerWindowService,
    factory: _ServerWindowService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ServerWindowService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var F_WINDOW = new InjectionToken("F_WINDOW", {
  providedIn: "root",
  factory: () => {
    return isPlatformBrowser(inject(PLATFORM_ID)) ? inject(BrowserWindowService) : inject(ServerWindowService);
  }
});
var EOperationSystem;
(function(EOperationSystem2) {
  EOperationSystem2["MAC_OS"] = "macos";
  EOperationSystem2["IOS"] = "ios";
  EOperationSystem2["WINDOWS"] = "windows";
  EOperationSystem2["ANDROID"] = "android";
  EOperationSystem2["LINUX"] = "linux";
})(EOperationSystem || (EOperationSystem = {}));
var hasV8BreakIterator;
try {
  hasV8BreakIterator = typeof Intl !== "undefined" && Intl.v8BreakIterator;
} catch {
  hasV8BreakIterator = false;
}
var PlatformService = class _PlatformService {
  _platformId;
  isBrowser = false;
  EDGE = this.isBrowser && /(edge)/i.test(navigator.userAgent);
  TRIDENT = this.isBrowser && /(msie|trident)/i.test(navigator.userAgent);
  BLINK = this.isBrowser && !!(window.chrome || hasV8BreakIterator) && typeof CSS !== "undefined" && !this.EDGE && !this.TRIDENT;
  WEBKIT = this.isBrowser && /AppleWebKit/i.test(navigator.userAgent) && !this.BLINK && !this.EDGE && !this.TRIDENT;
  IOS = this.isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
  FIREFOX = this.isBrowser && /(firefox|minefield)/i.test(navigator.userAgent);
  ANDROID = this.isBrowser && /android/i.test(navigator.userAgent) && !this.TRIDENT;
  SAFARI = this.isBrowser && /safari/i.test(navigator.userAgent) && this.WEBKIT;
  constructor(_platformId) {
    this._platformId = _platformId;
    this.isBrowser = this._platformId ? isPlatformBrowser(this._platformId) : typeof document === "object" && !!document;
  }
  getOS() {
    let userAgent = navigator.userAgent.toLowerCase(), macosPlatforms = /(macintosh|macintel|macppc|mac68k|macos)/i, windowsPlatforms = /(win32|win64|windows|wince)/i;
    let result;
    if (macosPlatforms.test(userAgent)) {
      result = EOperationSystem.MAC_OS;
    } else if (this.IOS) {
      result = EOperationSystem.IOS;
    } else if (windowsPlatforms.test(userAgent)) {
      result = EOperationSystem.WINDOWS;
    } else if (this.ANDROID) {
      result = EOperationSystem.ANDROID;
    } else if (!result && /linux/.test(userAgent)) {
      result = EOperationSystem.LINUX;
    }
    return result;
  }
  static ɵfac = function PlatformService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PlatformService)(ɵɵinject(PLATFORM_ID));
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _PlatformService,
    factory: _PlatformService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PlatformService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: Object,
    decorators: [{
      type: Inject,
      args: [PLATFORM_ID]
    }]
  }], null);
})();
var BrowserService = class _BrowserService {
  injectedDocument;
  windowService;
  localStorageService;
  platformService;
  constructor(injectedDocument, windowService, localStorageService, platformService) {
    this.injectedDocument = injectedDocument;
    this.windowService = windowService;
    this.localStorageService = localStorageService;
    this.platformService = platformService;
  }
  isBrowser() {
    return this.platformService.isBrowser;
  }
  get window() {
    return this.windowService;
  }
  get localStorage() {
    return this.localStorageService;
  }
  get document() {
    return this.injectedDocument;
  }
  toPixels(value, clientWidth, clientHeight, fontSize) {
    if (value.endsWith("px")) {
      return parseFloat(value);
    } else if (value.endsWith("%")) {
      const percentage = parseFloat(value) / 100;
      return Math.max(clientWidth, clientHeight) * percentage;
    } else if (value.endsWith("em")) {
      return parseFloat(value) * parseFloat(fontSize);
    } else if (value.endsWith("rem")) {
      return parseFloat(value) * parseFloat(getComputedStyle(this.document.documentElement).fontSize);
    } else if (value.endsWith("vh")) {
      const vh = this.window.innerHeight / 100;
      return parseFloat(value) * vh;
    } else if (value.endsWith("vw")) {
      const vw = this.window.innerWidth / 100;
      return parseFloat(value) * vw;
    }
    return parseFloat(value) || 0;
  }
  static ɵfac = function BrowserService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrowserService)(ɵɵinject(DOCUMENT), ɵɵinject(F_WINDOW), ɵɵinject(F_LOCAL_STORAGE), ɵɵinject(PlatformService));
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _BrowserService,
    factory: _BrowserService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrowserService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: Document,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [F_WINDOW]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [F_LOCAL_STORAGE]
    }]
  }, {
    type: PlatformService
  }], null);
})();

// node_modules/@foblex/utils/fesm2015/foblex-utils.js
function flatMap(payload, callback) {
  return payload.reduce((result, x) => [...result, ...callback(x)], []);
}
function deepCloneNode(node) {
  const clone = node.cloneNode(true);
  const descendantsWithId = clone.querySelectorAll("[id]");
  const nodeName = node.nodeName.toLowerCase();
  clone.removeAttribute("id");
  for (let i = 0; i < descendantsWithId.length; i++) {
    descendantsWithId[i].removeAttribute("id");
  }
  if (nodeName === "canvas") {
    transferCanvasData(node, clone);
  } else if (nodeName === "input" || nodeName === "select" || nodeName === "textarea") {
    transferInputData(node, clone);
  }
  transferData("canvas", node, clone, transferCanvasData);
  transferData("input, textarea, select", node, clone, transferInputData);
  return clone;
}
function transferData(selector, node, clone, callback) {
  const descendantElements = node.querySelectorAll(selector);
  if (descendantElements.length) {
    const cloneElements = clone.querySelectorAll(selector);
    for (let i = 0; i < descendantElements.length; i++) {
      callback(descendantElements[i], cloneElements[i]);
    }
  }
}
var cloneUniqueId = 0;
function transferInputData(source, clone) {
  if (clone.type !== "file") {
    clone.value = source.value;
  }
  if (clone.type === "radio" && clone.name) {
    clone.name = `mat-clone-${clone.name}-${cloneUniqueId++}`;
  }
}
function transferCanvasData(source, clone) {
  const context = clone.getContext("2d");
  if (context) {
    try {
      context.drawImage(source, 0, 0);
    } catch (_a) {
    }
  }
}
function extendStyles(dest, source, importantProperties) {
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      const value = source[key];
      if (value) {
        dest.setProperty(key, value, (importantProperties === null || importantProperties === void 0 ? void 0 : importantProperties.has(key)) ? "important" : "");
      } else {
        dest.removeProperty(key);
      }
    }
  }
  return dest;
}
function disableDragInteractions(element) {
  extendStyles(element.style, {
    "touch-action": "none",
    "-webkit-user-drag": "none",
    "-webkit-tap-highlight-color": "transparent",
    "user-select": "none",
    "-ms-user-select": "none",
    "-webkit-user-select": "none",
    "-moz-user-select": "none"
  });
}
function getDataAttrValueFromClosestElementWithClass(element, attr, cls) {
  return getClosestTarget(element, cls).dataset[attr];
}
function getClosestTarget(element, cls) {
  return element.closest(cls);
}
function getOrCreateRootNodeForViewRef(ref, _document) {
  const rootNodes = ref.rootNodes;
  if (rootNodes.length === 1 && rootNodes[0].nodeType === _document.ELEMENT_NODE) {
    return rootNodes[0];
  }
  const wrapper = _document.createElement("div");
  rootNodes.forEach((node) => wrapper.appendChild(node));
  return wrapper;
}
function isClosestElementHasClass(element, cls) {
  const target = getClosest(element, cls);
  return !!target && !target.classList.contains(cls + "-disabled");
}
function getClosest(element, cls) {
  return element.closest(cls);
}
function normalizeDomElementId(id) {
  if (!id.match(/^[a-zA-Z_]/)) {
    id = "_" + id;
  }
  return id.replace(/[^a-zA-Z0-9_\-:.]/g, "_");
}
function castToEnum(value, varname, enm) {
  const result = enm[value.toUpperCase()] || getKeyByValue(enm, value.toLowerCase());
  if (result === void 0) {
    throw new Error(`Unknown ${varname}: ${value}. Accepted values: ${Object.keys(enm).join(", ")}`);
  }
  return result;
}
function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

// node_modules/@foblex/flow/fesm2022/foblex-flow.mjs
function FConnectionWaypoints_Conditional_0_For_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵelement(0, "circle", 1);
  }
  if (rf & 2) {
    const candidate_r1 = ctx.$implicit;
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵattribute("r", ctx_r1.radius())("cx", candidate_r1.x)("cy", candidate_r1.y);
  }
}
function FConnectionWaypoints_Conditional_0_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = ɵɵgetCurrentView();
    ɵɵnamespaceSVG();
    ɵɵelementStart(0, "circle", 3);
    ɵɵlistener("contextmenu", function FConnectionWaypoints_Conditional_0_For_5_Template_circle_contextmenu_0_listener($event) {
      const $index_r4 = ɵɵrestoreView(_r3).$index;
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.remove($index_r4, $event));
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const point_r5 = ctx.$implicit;
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵattribute("r", ctx_r1.radius())("cx", point_r5.x)("cy", point_r5.y);
  }
}
function FConnectionWaypoints_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵelementStart(0, "svg", 0)(1, "g");
    ɵɵrepeaterCreate(2, FConnectionWaypoints_Conditional_0_For_3_Template, 1, 3, ":svg:circle", 1, ɵɵrepeaterTrackByIndex);
    ɵɵrepeaterCreate(4, FConnectionWaypoints_Conditional_0_For_5_Template, 1, 3, ":svg:circle", 2, ɵɵrepeaterTrackByIndex);
    ɵɵelementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵadvance(2);
    ɵɵrepeater(ctx_r1.candidates());
    ɵɵadvance(2);
    ɵɵrepeater(ctx_r1.waypoints());
  }
}
var _c0 = ["markerElement"];
var _c1 = ["fConnectionGradientRenderer", ""];
var _c2 = ["f-connection-path", ""];
var _c3 = ["fConnectionSelection", ""];
var _c4 = ["f-connection-drag-handle-start", ""];
var _c5 = ["f-connection-drag-handle-end", ""];
var _c6 = ["defs"];
var _c7 = ["*"];
var _c8 = ["fGroupsContainer"];
var _c9 = ["fNodesContainer"];
var _c10 = ["fConnectionsContainer"];
var _c11 = [[["", "fGroup", ""], ["", "fGroups", ""]], [["f-snap-connection"]], [["f-connection"], ["", "fConnections", ""]], [["f-connection-for-create"]], [["", "fNode", ""], ["", "fNodes", ""]]];
var _c12 = ["[fGroup], [fGroups]", "f-snap-connection", "f-connection, [fConnections]", "f-connection-for-create", "[fNode], [fNodes]"];
function FCanvasComponent_For_2_Case_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 3, 0);
    ɵɵprojection(2);
    ɵɵelementEnd();
  }
}
function FCanvasComponent_For_2_Case_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 4, 1);
    ɵɵprojection(2, 1);
    ɵɵprojection(3, 2);
    ɵɵprojection(4, 3);
    ɵɵelementEnd();
  }
}
function FCanvasComponent_For_2_Case_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 5, 2);
    ɵɵprojection(2, 4);
    ɵɵelementEnd();
  }
}
function FCanvasComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, FCanvasComponent_For_2_Case_0_Template, 3, 0, "div", 3)(1, FCanvasComponent_For_2_Case_1_Template, 5, 0, "div", 4)(2, FCanvasComponent_For_2_Case_2_Template, 3, 0, "div", 5);
  }
  if (rf & 2) {
    let tmp_10_0;
    const layer_r1 = ctx.$implicit;
    ɵɵconditional((tmp_10_0 = layer_r1) === "groups" ? 0 : tmp_10_0 === "connections" ? 1 : tmp_10_0 === "nodes" ? 2 : -1);
  }
}
var _c13 = [[["svg", "fMarker", ""]], [["f-connection-marker-circle"], ["f-connection-marker-arrow"]], [["f-connection-gradient"]], [["f-connection-waypoints"]], [["", "fConnectionContent", ""]]];
var _c14 = ["svg[fMarker]", "f-connection-marker-circle, f-connection-marker-arrow", "f-connection-gradient", "f-connection-waypoints", "[fConnectionContent]"];
function FConnectionComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵelement(0, "linearGradient", 3);
  }
  if (rf & 2) {
    ɵɵproperty("fConnectionGradientRendererFor", ctx);
  }
}
function FConnectionComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵelement(0, "circle", 6);
  }
}
function FConnectionComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0, 4);
  }
}
var _c15 = [[["svg", "fMarker", ""]], [["f-connection-marker-circle"], ["f-connection-marker-arrow"]], [["f-connection-gradient"]], [["", "fConnectionContent", ""]]];
var _c16 = ["svg[fMarker]", "f-connection-marker-circle, f-connection-marker-arrow", "f-connection-gradient", "[fConnectionContent]"];
function FConnectionForCreateComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵelement(0, "linearGradient", 3);
  }
  if (rf & 2) {
    ɵɵproperty("fConnectionGradientRendererFor", ctx);
  }
}
function FConnectionForCreateComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0, 3);
  }
}
function FSnapConnectionComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵelement(0, "linearGradient", 3);
  }
  if (rf & 2) {
    ɵɵproperty("fConnectionGradientRendererFor", ctx);
  }
}
function FSnapConnectionComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0, 3);
  }
}
var _c17 = "[_nghost-%COMP%]{pointer-events:none;position:absolute}[_nghost-%COMP%]   svg[_ngcontent-%COMP%]{overflow:visible}[_nghost-%COMP%]   svg[_ngcontent-%COMP%]   .f-connection-group[_ngcontent-%COMP%]{pointer-events:all}[_nghost-%COMP%]   .f-connection-content[_ngcontent-%COMP%]{pointer-events:all}";
var _c18 = "[_nghost-%COMP%]{display:block;position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden;pointer-events:none;-webkit-user-select:none;user-select:none}";
var _c19 = [[["", "fDefinitions", ""]], [["f-background"]], [["f-line-alignment"]], [["f-canvas"]], [["f-selection-area"]], "*"];
var _c20 = ["[fDefinitions]", "f-background", "f-line-alignment", "f-canvas", "f-selection-area", "*"];
var F_BACKGROUND_PATTERN = new InjectionToken("F_BACKGROUND_PATTERN");
var AddPatternToBackgroundRequest = class {
  fPattern;
  static fToken = Symbol("AddPatternToBackgroundRequest");
  constructor(fPattern) {
    this.fPattern = fPattern;
  }
};
var FIdRegistryBase = class {
  _items = [];
  _byId = /* @__PURE__ */ new Map();
  get(id) {
    return this._byId.get(id);
  }
  require(id) {
    const found = this._byId.get(id);
    if (!found) {
      throw new Error(`${this.kind} not found: ${id}`);
    }
    return found;
  }
  has(id) {
    return this._byId.has(id);
  }
  getAll() {
    return this._items;
  }
  size() {
    return this._items.length;
  }
  /**
   * Adds an instance.
   * If instance with the same id already exists — throws (keeps data consistent).
   */
  add(instance) {
    const id = instance.fId();
    if (this._byId.has(id)) {
      throw new Error(`${this.kind} already exists: ${id}`);
    }
    this._items.push(instance);
    this._byId.set(id, instance);
  }
  addMany(instances) {
    for (const instance of instances) {
      this.add(instance);
    }
  }
  /**
   * Removes by instance reference (fast path).
   * Returns `true` if removed, `false` if not found.
   */
  remove(instance) {
    const id = instance.fId();
    const existing = this._byId.get(id);
    if (!existing) {
      return false;
    }
    this._byId.delete(id);
    const index = this._items.indexOf(existing);
    if (index >= 0) {
      this._items.splice(index, 1);
    }
    return true;
  }
  /**
   * Removes by id.
   * Returns removed instance (if existed).
   */
  removeById(id) {
    const existing = this._byId.get(id);
    if (!existing) {
      return void 0;
    }
    this._byId.delete(id);
    const index = this._items.indexOf(existing);
    if (index >= 0) {
      this._items.splice(index, 1);
    }
    return existing;
  }
  /**
   * Clears registry (does NOT touch other state outside).
   */
  clear() {
    this._items.length = 0;
    this._byId.clear();
  }
};
function fInstanceKey(name) {
  return {
    name
  };
}
var FSingleRegistryBase = class {
  _instances = /* @__PURE__ */ new Map();
  get(key) {
    return this._instances.get(key.name);
  }
  require(key) {
    const instance = this.get(key);
    if (!instance) {
      throw new Error(`Instance not found: ${key.name}`);
    }
    return instance;
  }
  has(key) {
    return this._instances.has(key.name);
  }
  add(key, instance) {
    if (this._instances.has(key.name)) {
      throw new Error(`${key.name} already exists`);
    }
    this._instances.set(key.name, instance);
  }
  remove(key) {
    const existed = this._instances.has(key.name);
    if (!existed) {
      throw new Error(`${key.name} does not exist`);
    }
    this._instances.delete(key.name);
    return true;
  }
  clear() {
    this._instances.clear();
  }
};
var FConnectorRegistry = class extends FIdRegistryBase {
  kind;
  constructor(kind) {
    super();
    this.kind = kind;
  }
};
var FConnectionMarkerRegistry = class extends FIdRegistryBase {
  kind = "Connection Marker";
};
var FConnectionRegistry = class extends FIdRegistryBase {
  kind = "Connection";
  _instancesForCreate;
  _instancesForSnap;
  getForSnap() {
    return this._instancesForSnap;
  }
  getForCreate() {
    return this._instancesForCreate;
  }
  addForCreate(instance) {
    this._instancesForCreate = instance;
  }
  addForSnap(instance) {
    this._instancesForSnap = instance;
  }
  removeInstanceForCreate() {
    this._instancesForCreate = void 0;
  }
  removeInstanceForSnap() {
    this._instancesForSnap = void 0;
  }
};
var FNodeRegistry = class extends FIdRegistryBase {
  kind = "Node";
};
var ListenConnectionsChangesRequest = class {
  notifyOnSubscribe;
  static fToken = Symbol("ListenConnectionsChangesRequest");
  constructor(notifyOnSubscribe = true) {
    this.notifyOnSubscribe = notifyOnSubscribe;
  }
};
function afterNextPaint() {
  return (callback) => {
    let raf1 = null;
    let raf2 = null;
    const cancel = () => {
      if (raf1 !== null) cancelAnimationFrame(raf1);
      if (raf2 !== null) cancelAnimationFrame(raf2);
      raf1 = raf2 = null;
    };
    return {
      callback: () => {
        cancel();
        raf1 = requestAnimationFrame(() => {
          raf1 = null;
          raf2 = requestAnimationFrame(() => {
            raf2 = null;
            callback();
          });
        });
      },
      cleanup: cancel
    };
  };
}
function debounceAnimationFrame() {
  return (callback) => {
    let rafId = null;
    return {
      callback: () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          rafId = null;
          callback();
        });
      },
      cleanup: () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
  };
}
function debounceMicrotask() {
  return (callback) => {
    let scheduled = false;
    return {
      callback: () => {
        if (scheduled) return;
        scheduled = true;
        queueMicrotask(() => {
          scheduled = false;
          callback();
        });
      },
      cleanup: () => {
        scheduled = false;
      }
    };
  };
}
function debounceTime(delay) {
  return (callback) => {
    let timeoutId = null;
    return {
      callback: () => {
        if (timeoutId !== null) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          timeoutId = null;
          callback();
        }, delay);
      },
      cleanup: () => {
        if (timeoutId !== null) clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
  };
}
var FChannel = class {
  _listeners = /* @__PURE__ */ new Set();
  notify() {
    this._listeners.forEach((callback) => callback());
  }
  listen(callback) {
    this._listeners.add(callback);
    return () => this.stop(callback);
  }
  stop(callback) {
    this._listeners.delete(callback);
  }
};
var FResizeChannel = class extends FChannel {
  _htmlElement;
  _observer = new ResizeObserver(() => this.notify());
  _isObserving = false;
  constructor(_htmlElement) {
    super();
    this._htmlElement = _htmlElement;
  }
  listen(callback) {
    if (!this._isObserving) {
      this._observer.observe(this._htmlElement);
      this._isObserving = true;
    }
    return super.listen(callback);
  }
  stop(callback) {
    super.stop(callback);
    if (this._listeners.size === 0) {
      this._disconnect();
    }
  }
  _disconnect() {
    this._observer.unobserve(this._htmlElement);
    this._observer.disconnect();
    this._isObserving = false;
  }
};
var FChannelHub = class _FChannelHub {
  _channels = [];
  _operators = [];
  constructor(...channels) {
    this._channels = [...channels];
  }
  pipe(...operators) {
    const result = new _FChannelHub(...this._channels);
    result._operators = [...this._operators, ...operators];
    return result;
  }
  listen(destroyRef, callback) {
    let current = callback;
    const cleanups = [];
    const onSubscribes = [];
    const teardownSetters = [];
    for (const operator of [...this._operators].reverse()) {
      const res = operator(current);
      current = res.callback;
      if (res.cleanup) cleanups.push(res.cleanup);
      if (res.onSubscribe) onSubscribes.push(res.onSubscribe);
      if (res.setTeardown) teardownSetters.push(res.setTeardown);
    }
    const unsubs = this._channels.map((ch) => ch.listen(() => current()));
    let unregisterOnDestroy = null;
    let tornDown = false;
    const teardown = () => {
      if (tornDown) return;
      tornDown = true;
      unregisterOnDestroy?.();
      unregisterOnDestroy = null;
      unsubs.forEach((u) => u());
      cleanups.forEach((c) => c());
    };
    teardownSetters.slice().reverse().forEach((set) => set(teardown));
    onSubscribes.slice().reverse().forEach((fn) => fn(current));
    unregisterOnDestroy = destroyRef.onDestroy(teardown);
  }
};
function notifyOnStart() {
  return (callback) => {
    let active = true;
    return {
      callback,
      onSubscribe: (finalCallback) => {
        queueMicrotask(() => {
          if (!active) return;
          finalCallback();
        });
      },
      cleanup: () => {
        active = false;
      }
    };
  };
}
function takeOne() {
  return (callback) => {
    let taken = false;
    let teardown = null;
    return {
      setTeardown: (t) => teardown = t,
      callback: () => {
        if (taken) return;
        taken = true;
        try {
          callback();
        } finally {
          teardown?.();
        }
      }
    };
  };
}
var ListenConnectionsChanges = class ListenConnectionsChanges2 {
  _store = inject(FComponentsStore);
  handle({
    notifyOnSubscribe
  }) {
    return notifyOnSubscribe ? new FChannelHub(this._store.connectionsChanges$).pipe(notifyOnStart(), debounceTime(1)) : new FChannelHub(this._store.connectionsChanges$).pipe(debounceTime(1));
  }
  static ɵfac = function ListenConnectionsChanges_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ListenConnectionsChanges2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ListenConnectionsChanges2,
    factory: ListenConnectionsChanges2.ɵfac
  });
};
ListenConnectionsChanges = __decorate([FExecutionRegister(ListenConnectionsChangesRequest)], ListenConnectionsChanges);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ListenConnectionsChanges, [{
    type: Injectable
  }], null, null);
})();
var ListenNodesChangesRequest = class {
  static fToken = Symbol("ListenNodesChangesRequest");
};
var ListenNodesChanges = class ListenNodesChanges2 {
  _store = inject(FComponentsStore);
  handle(_) {
    return new FChannelHub(this._store.nodesChanges$);
  }
  static ɵfac = function ListenNodesChanges_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ListenNodesChanges2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ListenNodesChanges2,
    factory: ListenNodesChanges2.ɵfac
  });
};
ListenNodesChanges = __decorate([FExecutionRegister(ListenNodesChangesRequest)], ListenNodesChanges);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ListenNodesChanges, [{
    type: Injectable
  }], null, null);
})();
var ListenTransformChangesRequest = class {
  static fToken = Symbol("ListenTransformChangesRequest");
};
var ListenTransformChanges = class ListenTransformChanges2 {
  _store = inject(FComponentsStore);
  handle(_) {
    return new FChannelHub(this._store.transformChanges$, this._store.connectionsChanges$, this._store.nodesChanges$);
  }
  static ɵfac = function ListenTransformChanges_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ListenTransformChanges2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ListenTransformChanges2,
    factory: ListenTransformChanges2.ɵfac
  });
};
ListenTransformChanges = __decorate([FExecutionRegister(ListenTransformChangesRequest)], ListenTransformChanges);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ListenTransformChanges, [{
    type: Injectable
  }], null, null);
})();
var EmitConnectionsChangesRequest = class {
  static fToken = Symbol("EmitConnectionsChangesRequest");
};
var EmitConnectionsChanges = class EmitConnectionsChanges2 {
  _store = inject(FComponentsStore);
  handle(_) {
    this._store.emitConnectionChanges();
  }
  static ɵfac = function EmitConnectionsChanges_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || EmitConnectionsChanges2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: EmitConnectionsChanges2,
    factory: EmitConnectionsChanges2.ɵfac
  });
};
EmitConnectionsChanges = __decorate([FExecutionRegister(EmitConnectionsChangesRequest)], EmitConnectionsChanges);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EmitConnectionsChanges, [{
    type: Injectable
  }], null, null);
})();
var NotifyTransformChangedRequest = class {
  static fToken = Symbol("NotifyTransformChangedRequest");
};
var FComponentsStore = class _FComponentsStore {
  transformChanges$ = new FChannel();
  viewportAnimationChanges$ = new FChannel();
  connectionsChanges$ = new FChannel();
  _connectionsRevision = 0;
  connectionsRenderedChanges$ = new FChannel();
  _connectionsRenderedRevision = 0;
  _connectionsRenderedNodesRevision = 0;
  _viewportAnimationCount = 0;
  nodesChanges$ = new FChannel();
  _nodesRevision = 0;
  progressiveRenderChanges$ = new FChannel();
  _pendingProgressiveRenderCount = 0;
  get connectionsRevision() {
    return this._connectionsRevision;
  }
  get connectionsRenderedRevision() {
    return this._connectionsRenderedRevision;
  }
  get connectionsRenderedNodesRevision() {
    return this._connectionsRenderedNodesRevision;
  }
  get nodesRevision() {
    return this._nodesRevision;
  }
  get hasPendingProgressiveRender() {
    return this._pendingProgressiveRenderCount > 0;
  }
  get isViewportAnimating() {
    return this._viewportAnimationCount > 0;
  }
  get flowHost() {
    return this.fFlow?.hostElement;
  }
  fFlow;
  fCanvas;
  get transform() {
    return this.fCanvas?.transform;
  }
  nodes = new FNodeRegistry();
  connections = new FConnectionRegistry();
  connectionMarkers = new FConnectionMarkerRegistry();
  outputs = new FConnectorRegistry("Output");
  inputs = new FConnectorRegistry("Input");
  outlets = new FConnectorRegistry("Outlet");
  instances = new FSingleRegistryBase();
  fDraggable;
  emitNodeChanges() {
    this._nodesRevision++;
    this.nodesChanges$.notify();
  }
  emitConnectionChanges() {
    this._connectionsRevision++;
    this.connectionsChanges$.notify();
  }
  completeConnectionsRender(revision, nodesRevision) {
    if (revision < this._connectionsRenderedRevision || revision === this._connectionsRenderedRevision && nodesRevision <= this._connectionsRenderedNodesRevision) {
      return;
    }
    this._connectionsRenderedRevision = Math.min(revision, this._connectionsRevision);
    this._connectionsRenderedNodesRevision = nodesRevision;
    this.connectionsRenderedChanges$.notify();
  }
  beginProgressiveRender() {
    this._pendingProgressiveRenderCount++;
    this.progressiveRenderChanges$.notify();
  }
  endProgressiveRender() {
    if (!this._pendingProgressiveRenderCount) {
      return;
    }
    this._pendingProgressiveRenderCount--;
    this.progressiveRenderChanges$.notify();
  }
  transformChanged() {
    this.transformChanges$.notify();
  }
  beginViewportAnimation() {
    this._viewportAnimationCount++;
    this.viewportAnimationChanges$.notify();
  }
  endViewportAnimation() {
    if (!this._viewportAnimationCount) {
      return;
    }
    this._viewportAnimationCount--;
    this.viewportAnimationChanges$.notify();
  }
  static ɵfac = function FComponentsStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FComponentsStore)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _FComponentsStore,
    factory: _FComponentsStore.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FComponentsStore, [{
    type: Injectable
  }], null, null);
})();
var INSTANCES = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  MAGNETIC_LINES: fInstanceKey("magnetic-lines"),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  MAGNETIC_RECTS: fInstanceKey("magnetic-rects"),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ZOOM: fInstanceKey("zoom-controls"),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  BACKGROUND: fInstanceKey("background"),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  SELECTION_AREA: fInstanceKey("selection-area"),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  MINIMAP: fInstanceKey("minimap"),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  AUTO_PAN: fInstanceKey("auto-pan")
};
var NotifyTransformChanged = class NotifyTransformChanged2 {
  _store = inject(FComponentsStore);
  handle(_request) {
    this._store.transformChanged();
  }
  static ɵfac = function NotifyTransformChanged_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NotifyTransformChanged2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: NotifyTransformChanged2,
    factory: NotifyTransformChanged2.ɵfac
  });
};
NotifyTransformChanged = __decorate([FExecutionRegister(NotifyTransformChangedRequest)], NotifyTransformChanged);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotifyTransformChanged, [{
    type: Injectable
  }], null, null);
})();
var RegisterPluginInstanceRequest = class {
  key;
  instance;
  static fToken = Symbol("RegisterPluginInstanceRequest");
  constructor(key, instance) {
    this.key = key;
    this.instance = instance;
  }
};
var RegisterPluginInstance = class RegisterPluginInstance2 {
  _store = inject(FComponentsStore);
  handle({
    key,
    instance
  }) {
    this._store.instances.add(key, instance);
  }
  static ɵfac = function RegisterPluginInstance_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RegisterPluginInstance2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RegisterPluginInstance2,
    factory: RegisterPluginInstance2.ɵfac
  });
};
RegisterPluginInstance = __decorate([FExecutionRegister(RegisterPluginInstanceRequest)], RegisterPluginInstance);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RegisterPluginInstance, [{
    type: Injectable
  }], null, null);
})();
var RemovePluginInstanceRequest = class {
  key;
  static fToken = Symbol("RemovePluginInstanceRequest");
  constructor(key) {
    this.key = key;
  }
};
var RemovePluginInstance = class RemovePluginInstance2 {
  _store = inject(FComponentsStore);
  handle({
    key
  }) {
    this._store.instances.remove(key);
  }
  static ɵfac = function RemovePluginInstance_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RemovePluginInstance2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RemovePluginInstance2,
    factory: RemovePluginInstance2.ɵfac
  });
};
RemovePluginInstance = __decorate([FExecutionRegister(RemovePluginInstanceRequest)], RemovePluginInstance);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RemovePluginInstance, [{
    type: Injectable
  }], null, null);
})();
var F_STORAGE_PROVIDERS = [FComponentsStore, ListenNodesChanges, ListenConnectionsChanges, ListenTransformChanges, EmitConnectionsChanges, NotifyTransformChanged, RegisterPluginInstance, RemovePluginInstance];
var uniqueId$d = 0;
var AddPatternToBackground = class AddPatternToBackground2 {
  _store = inject(FComponentsStore);
  _browser = inject(BrowserService);
  get _backgroundElement() {
    return this._store.instances.get(INSTANCES.BACKGROUND)?.hostElement;
  }
  handle(request) {
    const patterns = this._getPatterns(request.fPattern?.hostElement);
    if (!patterns?.length) {
      return;
    }
    const defs = createSVGElement("defs", this._browser);
    request.fPattern?.hostElement.remove();
    patterns.forEach((pattern) => {
      defs.append(pattern);
    });
    if (patterns.length) {
      this._backgroundElement?.firstChild?.appendChild(defs);
      patterns[patterns.length - 1].id = "f-background-pattern-" + uniqueId$d++;
      const lastPatternId = patterns[patterns.length - 1].id;
      const rect = createSVGElement("rect", this._browser);
      rect.setAttribute("fill", "url(#" + lastPatternId + ")");
      rect.setAttribute("width", "100%");
      rect.setAttribute("height", "100%");
      this._backgroundElement?.firstChild?.appendChild(rect);
      const transform = this._store.fCanvas?.transform || TransformModelExtensions.default();
      request.fPattern?.setTransform(transform);
    }
  }
  _getPatterns(element) {
    return Array.from(element?.getElementsByTagName("pattern") || []);
  }
  static ɵfac = function AddPatternToBackground_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || AddPatternToBackground2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: AddPatternToBackground2,
    factory: AddPatternToBackground2.ɵfac
  });
};
AddPatternToBackground = __decorate([FExecutionRegister(AddPatternToBackgroundRequest)], AddPatternToBackground);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AddPatternToBackground, [{
    type: Injectable
  }], null, null);
})();
var SetBackgroundTransformRequest = class {
  fTransform;
  static fToken = Symbol("SetBackgroundTransformRequest");
  constructor(fTransform) {
    this.fTransform = fTransform;
  }
};
var SetBackgroundTransform = class SetBackgroundTransform2 {
  _store = inject(FComponentsStore);
  handle(request) {
    this._store.instances.get(INSTANCES.BACKGROUND)?.setTransform(request.fTransform);
  }
  static ɵfac = function SetBackgroundTransform_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SetBackgroundTransform2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: SetBackgroundTransform2,
    factory: SetBackgroundTransform2.ɵfac
  });
};
SetBackgroundTransform = __decorate([FExecutionRegister(SetBackgroundTransformRequest)], SetBackgroundTransform);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SetBackgroundTransform, [{
    type: Injectable
  }], null, null);
})();
var F_BACKGROUND_FEATURES = [AddPatternToBackground, SetBackgroundTransform];
var AddCanvasToStoreRequest = class {
  instance;
  static fToken = Symbol("AddCanvasToStoreRequest");
  constructor(instance) {
    this.instance = instance;
  }
};
var AddCanvasToStore = class AddCanvasToStore2 {
  _store = inject(FComponentsStore);
  handle({
    instance
  }) {
    this._store.fCanvas = instance;
  }
  static ɵfac = function AddCanvasToStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || AddCanvasToStore2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: AddCanvasToStore2,
    factory: AddCanvasToStore2.ɵfac
  });
};
AddCanvasToStore = __decorate([FExecutionRegister(AddCanvasToStoreRequest)], AddCanvasToStore);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AddCanvasToStore, [{
    type: Injectable
  }], null, null);
})();
var CenterGroupOrNodeRequest = class {
  id;
  animated;
  static fToken = Symbol("CenterGroupOrNodeRequest");
  constructor(id, animated) {
    this.id = id;
    this.animated = animated;
  }
};
var CenterGroupOrNode = class CenterGroupOrNode2 {
  _store = inject(FComponentsStore);
  _mediator = inject(FMediator);
  get _transform() {
    return this._store.transform;
  }
  handle({
    id,
    animated
  }) {
    const node = this._store.nodes.get(id);
    if (!node) {
      return;
    }
    this._toCenter(this._getNodeRect(node), this._getFlowRect(), node._position);
    this._mediator.execute(new RedrawCanvasWithAnimationRequest(animated, ECanvasRedrawContext.VIEWPORT_ONLY));
  }
  _toCenter(fNodeRect, fFlowRect, position) {
    this._transform.scaledPosition = PointExtensions.initialize();
    this._transform.position = PointExtensions.initialize((fFlowRect.width - fNodeRect.width) / 2 - position.x * this._transform.scale, (fFlowRect.height - fNodeRect.height) / 2 - position.y * this._transform.scale);
  }
  _getNodeRect(fNode) {
    return RectExtensions.fromElement(fNode.hostElement);
  }
  _getFlowRect() {
    return RectExtensions.fromElement(this._store.flowHost);
  }
  static ɵfac = function CenterGroupOrNode_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CenterGroupOrNode2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CenterGroupOrNode2,
    factory: CenterGroupOrNode2.ɵfac
  });
};
CenterGroupOrNode = __decorate([FExecutionRegister(CenterGroupOrNodeRequest)], CenterGroupOrNode);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CenterGroupOrNode, [{
    type: Injectable
  }], null, null);
})();
var FitToFlowRequest = class {
  toCenter;
  animated;
  static fToken = Symbol("FitToFlowRequest");
  constructor(toCenter, animated) {
    this.toCenter = toCenter;
    this.animated = animated;
  }
};
var FitToFlow = class FitToFlow2 {
  _store = inject(FComponentsStore);
  get _transform() {
    return this._store.transform;
  }
  _mediator = inject(FMediator);
  handle({
    toCenter,
    animated
  }) {
    const fNodesRect = this._mediator.execute(new CalculateNodesBoundingBoxRequest()) || RectExtensions.initialize();
    if (fNodesRect.width === 0 || fNodesRect.height === 0) {
      return;
    }
    this.fitToParent(fNodesRect, RectExtensions.fromElement(this._store.flowHost), this._store.nodes.getAll().map((x) => x._position), toCenter);
    this._mediator.execute(new RedrawCanvasWithAnimationRequest(animated, ECanvasRedrawContext.VIEWPORT_ONLY));
  }
  fitToParent(rect, parentRect, points, toCenter) {
    this._transform.scaledPosition = PointExtensions.initialize();
    this._transform.position = this._getZeroPositionWithoutScale(points);
    const itemsContainerWidth = rect.width / this._transform.scale + toCenter.x;
    const itemsContainerHeight = rect.height / this._transform.scale + toCenter.y;
    if (itemsContainerWidth > parentRect.width || itemsContainerHeight > parentRect.height || itemsContainerWidth < parentRect.width && itemsContainerHeight < parentRect.height) {
      this._transform.scale = Math.min(parentRect.width / itemsContainerWidth, parentRect.height / itemsContainerHeight);
    }
    const newX = (parentRect.width - itemsContainerWidth * this._transform.scale) / 2 - this._transform.position.x * this._transform.scale;
    const newY = (parentRect.height - itemsContainerHeight * this._transform.scale) / 2 - this._transform.position.y * this._transform.scale;
    this._transform.position = PointExtensions.initialize(newX + toCenter.x / 2 * this._transform.scale, newY + toCenter.y / 2 * this._transform.scale);
  }
  _getZeroPositionWithoutScale(points) {
    const xPoint = points.length ? Math.min(...points.map((point) => point.x)) : 0;
    const yPoint = points.length ? Math.min(...points.map((point) => point.y)) : 0;
    return PointExtensions.initialize(xPoint, yPoint);
  }
  static ɵfac = function FitToFlow_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || FitToFlow2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: FitToFlow2,
    factory: FitToFlow2.ɵfac
  });
};
FitToFlow = __decorate([FExecutionRegister(FitToFlowRequest)], FitToFlow);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FitToFlow, [{
    type: Injectable
  }], null, null);
})();
var InputCanvasPositionRequest = class {
  transform;
  position;
  static fToken = Symbol("InputCanvasPositionRequest");
  constructor(transform, position) {
    this.transform = transform;
    this.position = position;
  }
};
var InputCanvasPosition = class InputCanvasPosition2 {
  _store = inject(FComponentsStore);
  handle({
    transform,
    position
  }) {
    if (!position) {
      return;
    }
    if (!PointExtensions.isEqual(this._calculateTransformPosition(transform), position)) {
      transform.position = position;
      transform.scaledPosition = PointExtensions.initialize();
      this._store.fCanvas?.redraw();
    }
  }
  _calculateTransformPosition(transform) {
    return PointExtensions.sum(transform.position, transform.scaledPosition);
  }
  static ɵfac = function InputCanvasPosition_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || InputCanvasPosition2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: InputCanvasPosition2,
    factory: InputCanvasPosition2.ɵfac
  });
};
InputCanvasPosition = __decorate([FExecutionRegister(InputCanvasPositionRequest)], InputCanvasPosition);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InputCanvasPosition, [{
    type: Injectable
  }], null, null);
})();
var InputCanvasScaleRequest = class {
  transform;
  scale;
  static fToken = Symbol("InputCanvasScaleRequest");
  constructor(transform, scale) {
    this.transform = transform;
    this.scale = scale;
  }
};
var InputCanvasScale = class InputCanvasScale2 {
  _store = inject(FComponentsStore);
  handle(request) {
    if (!request.scale && request.scale !== 0) {
      return;
    }
    request.transform.scale = request.scale;
    this._store.fCanvas?.redraw();
  }
  static ɵfac = function InputCanvasScale_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || InputCanvasScale2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: InputCanvasScale2,
    factory: InputCanvasScale2.ɵfac
  });
};
InputCanvasScale = __decorate([FExecutionRegister(InputCanvasScaleRequest)], InputCanvasScale);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InputCanvasScale, [{
    type: Injectable
  }], null, null);
})();
var ECanvasRedrawContext;
(function(ECanvasRedrawContext2) {
  ECanvasRedrawContext2["VIEWPORT_ONLY"] = "VIEWPORT_ONLY";
  ECanvasRedrawContext2["WITH_CONNECTION_CHANGES"] = "WITH_CONNECTION_CHANGES";
})(ECanvasRedrawContext || (ECanvasRedrawContext = {}));
var RedrawCanvasWithAnimationRequest = class {
  animated;
  context;
  static fToken = Symbol("RedrawCanvasWithAnimationRequest");
  constructor(animated, context = ECanvasRedrawContext.WITH_CONNECTION_CHANGES) {
    this.animated = animated;
    this.context = context;
  }
};
function transitionEnd(element, callback) {
  const onTransitionEnd = (event) => {
    if (event.propertyName === "transform") {
      element.removeEventListener("transitionend", onTransitionEnd);
      callback(event);
    }
  };
  element.addEventListener("transitionend", onTransitionEnd);
}
var RedrawCanvasWithAnimation = class RedrawCanvasWithAnimation2 {
  _store = inject(FComponentsStore);
  get _canvas() {
    return this._store.fCanvas;
  }
  handle(request) {
    request.animated ? this._redrawWithAnimation(request.context) : this._redraw(request.context);
    this._canvas?.emitCanvasChangeEvent();
  }
  _redrawWithAnimation(context) {
    this._store.beginViewportAnimation();
    this._canvas?.redrawWithAnimation();
    transitionEnd(this._canvas.hostElement, () => {
      this._store.endViewportAnimation();
      if (context === ECanvasRedrawContext.WITH_CONNECTION_CHANGES) {
        this._store.emitConnectionChanges();
      }
    });
  }
  _redraw(context) {
    this._canvas?.redraw();
    if (context === ECanvasRedrawContext.WITH_CONNECTION_CHANGES) {
      this._store.emitConnectionChanges();
    }
  }
  static ɵfac = function RedrawCanvasWithAnimation_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RedrawCanvasWithAnimation2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RedrawCanvasWithAnimation2,
    factory: RedrawCanvasWithAnimation2.ɵfac
  });
};
RedrawCanvasWithAnimation = __decorate([FExecutionRegister(RedrawCanvasWithAnimationRequest)], RedrawCanvasWithAnimation);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RedrawCanvasWithAnimation, [{
    type: Injectable
  }], null, null);
})();
var RemoveCanvasFromStoreRequest = class {
  static fToken = Symbol("RemoveCanvasFromStoreRequest");
};
var RemoveCanvasFromStore = class RemoveCanvasFromStore2 {
  _store = inject(FComponentsStore);
  handle(_) {
    this._store.fCanvas = void 0;
  }
  static ɵfac = function RemoveCanvasFromStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RemoveCanvasFromStore2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RemoveCanvasFromStore2,
    factory: RemoveCanvasFromStore2.ɵfac
  });
};
RemoveCanvasFromStore = __decorate([FExecutionRegister(RemoveCanvasFromStoreRequest)], RemoveCanvasFromStore);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RemoveCanvasFromStore, [{
    type: Injectable
  }], null, null);
})();
var ResetScaleRequest = class {
  static fToken = Symbol("ResetScaleRequest");
};
var ResetScale = class ResetScale2 {
  _store = inject(FComponentsStore);
  get _transform() {
    return this._store.transform;
  }
  handle(_) {
    this._transform.scale = 1;
    this._transform.scaledPosition = PointExtensions.initialize();
  }
  static ɵfac = function ResetScale_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ResetScale2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ResetScale2,
    factory: ResetScale2.ɵfac
  });
};
ResetScale = __decorate([FExecutionRegister(ResetScaleRequest)], ResetScale);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResetScale, [{
    type: Injectable
  }], null, null);
})();
var ResetScaleAndCenterRequest = class {
  animated;
  static fToken = Symbol("ResetScaleAndCenterRequest");
  constructor(animated) {
    this.animated = animated;
  }
};
var ResetScaleAndCenter = class ResetScaleAndCenter2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  get _transform() {
    return this._store.transform;
  }
  handle({
    animated
  }) {
    const nodesRect = this._mediator.execute(new CalculateNodesBoundingBoxRequest()) || RectExtensions.initialize();
    if (nodesRect.width === 0 || nodesRect.height === 0) {
      return;
    }
    this._oneToOneCentering(nodesRect, RectExtensions.fromElement(this._store.flowHost), this._store.nodes.getAll().map((x) => x._position));
    this._mediator.execute(new RedrawCanvasWithAnimationRequest(animated, ECanvasRedrawContext.VIEWPORT_ONLY));
  }
  _oneToOneCentering(rect, parentRect, points) {
    this._transform.scaledPosition = PointExtensions.initialize();
    this._transform.position = this._getZeroPositionWithoutScale(points);
    const newX = (parentRect.width - rect.width / this._transform.scale) / 2 - this._transform.position.x;
    const newY = (parentRect.height - rect.height / this._transform.scale) / 2 - this._transform.position.y;
    this._transform.scale = 1;
    this._transform.position = PointExtensions.initialize(newX, newY);
  }
  _getZeroPositionWithoutScale(points) {
    const xPoint = points.length ? Math.min(...points.map((point) => point.x)) : 0;
    const yPoint = points.length ? Math.min(...points.map((point) => point.y)) : 0;
    return PointExtensions.initialize(xPoint, yPoint);
  }
  static ɵfac = function ResetScaleAndCenter_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ResetScaleAndCenter2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ResetScaleAndCenter2,
    factory: ResetScaleAndCenter2.ɵfac
  });
};
ResetScaleAndCenter = __decorate([FExecutionRegister(ResetScaleAndCenterRequest)], ResetScaleAndCenter);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResetScaleAndCenter, [{
    type: Injectable
  }], null, null);
})();
var UpdateScaleRequest = class {
  scale;
  toPosition;
  static fToken = Symbol("UpdateScaleRequest");
  constructor(scale, toPosition) {
    this.scale = scale;
    this.toPosition = toPosition;
  }
};
var UpdateScale = class UpdateScale2 {
  _store = inject(FComponentsStore);
  get _transform() {
    return this._store.transform;
  }
  handle({
    scale,
    toPosition
  }) {
    if (scale === this._transform.scale) {
      return;
    }
    const summaryPosition = PointExtensions.sum(this._transform.scaledPosition, this._transform.position);
    const newX = toPosition.x - (toPosition.x - summaryPosition.x) * scale / this._transform.scale;
    const newY = toPosition.y - (toPosition.y - summaryPosition.y) * scale / this._transform.scale;
    this._transform.scale = scale;
    this._transform.scaledPosition = PointExtensions.sub(PointExtensions.initialize(newX, newY), this._transform.position);
  }
  static ɵfac = function UpdateScale_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || UpdateScale2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: UpdateScale2,
    factory: UpdateScale2.ɵfac
  });
};
UpdateScale = __decorate([FExecutionRegister(UpdateScaleRequest)], UpdateScale);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UpdateScale, [{
    type: Injectable
  }], null, null);
})();
var F_CANVAS_FEATURES = [AddCanvasToStore, CenterGroupOrNode, FitToFlow, InputCanvasPosition, InputCanvasScale, RedrawCanvasWithAnimation, RemoveCanvasFromStore, ResetScale, ResetScaleAndCenter, UpdateScale];
var AddConnectionForCreateToStoreRequest = class {
  connection;
  static fToken = Symbol("AddConnectionForCreateToStoreRequest");
  constructor(connection) {
    this.connection = connection;
  }
};
var AddConnectionForCreateToStore = class AddConnectionForCreateToStore2 {
  _store = inject(FComponentsStore);
  handle({
    connection
  }) {
    this._store.connections.addForCreate(connection);
  }
  static ɵfac = function AddConnectionForCreateToStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || AddConnectionForCreateToStore2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: AddConnectionForCreateToStore2,
    factory: AddConnectionForCreateToStore2.ɵfac
  });
};
AddConnectionForCreateToStore = __decorate([FExecutionRegister(AddConnectionForCreateToStoreRequest)], AddConnectionForCreateToStore);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AddConnectionForCreateToStore, [{
    type: Injectable
  }], null, null);
})();
var AddConnectionMarkerToStoreRequest = class {
  instance;
  static fToken = Symbol("AddConnectionMarkerToStoreRequest");
  constructor(instance) {
    this.instance = instance;
  }
};
var AddConnectionMarkerToStore = class AddConnectionMarkerToStore2 {
  _store = inject(FComponentsStore);
  handle({
    instance
  }) {
    this._store.connectionMarkers.add(instance);
    this._store.emitNodeChanges();
  }
  static ɵfac = function AddConnectionMarkerToStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || AddConnectionMarkerToStore2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: AddConnectionMarkerToStore2,
    factory: AddConnectionMarkerToStore2.ɵfac
  });
};
AddConnectionMarkerToStore = __decorate([FExecutionRegister(AddConnectionMarkerToStoreRequest)], AddConnectionMarkerToStore);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AddConnectionMarkerToStore, [{
    type: Injectable
  }], null, null);
})();
var AddConnectionToStoreRequest = class {
  connection;
  static fToken = Symbol("AddConnectionToStoreRequest");
  constructor(connection) {
    this.connection = connection;
  }
};
var AddConnectionToStore = class AddConnectionToStore2 {
  _store = inject(FComponentsStore);
  handle({
    connection
  }) {
    this._store.connections.add(connection);
    this._store.emitConnectionChanges();
  }
  static ɵfac = function AddConnectionToStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || AddConnectionToStore2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: AddConnectionToStore2,
    factory: AddConnectionToStore2.ɵfac
  });
};
AddConnectionToStore = __decorate([FExecutionRegister(AddConnectionToStoreRequest)], AddConnectionToStore);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AddConnectionToStore, [{
    type: Injectable
  }], null, null);
})();
var AddSnapConnectionToStoreRequest = class {
  connection;
  static fToken = Symbol("AddSnapConnectionToStoreRequest");
  constructor(connection) {
    this.connection = connection;
  }
};
var AddSnapConnectionToStore = class AddSnapConnectionToStore2 {
  _store = inject(FComponentsStore);
  handle({
    connection
  }) {
    this._store.connections.addForSnap(connection);
  }
  static ɵfac = function AddSnapConnectionToStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || AddSnapConnectionToStore2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: AddSnapConnectionToStore2,
    factory: AddSnapConnectionToStore2.ɵfac
  });
};
AddSnapConnectionToStore = __decorate([FExecutionRegister(AddSnapConnectionToStoreRequest)], AddSnapConnectionToStore);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AddSnapConnectionToStore, [{
    type: Injectable
  }], null, null);
})();
var CreateConnectionMarkersRequest = class {
  connection;
  static fToken = Symbol("CreateConnectionMarkersRequest");
  constructor(connection) {
    this.connection = connection;
  }
};
var F_CONNECTION_CONTENT = new InjectionToken("F_CONNECTION_CONTENT");
var FConnectionContentBase = class {
  /**
   * The host DOM element to which the directive is applied.
   * Used internally for positioning calculations.
   */
  hostElement = inject(ElementRef).nativeElement;
};
var Polyline = class _Polyline {
  /** Cleaned points (with consecutive duplicates removed). */
  points;
  /** Cumulative length from start to each vertex. Same length as `points`. */
  cumulativeLengths;
  /** Unit tangent per segment `i` for segment [i -> i+1]. Length = points.length - 1. */
  segmentTangents;
  /** Total length of the polyline (>= 1 for the degenerate fallback). */
  totalLength;
  /**
   * Construct a polyline from raw points.
   * Consecutive duplicate points are removed.
   * If less than 2 points remain, it falls back to a unit horizontal segment [0,0] → [1,0].
   */
  constructor(points) {
    const cleaned = _Polyline._removeConsecutiveDuplicates(points);
    if (cleaned.length < 2) {
      this.points = [{
        x: 0,
        y: 0
      }, {
        x: 1,
        y: 0
      }];
      this.cumulativeLengths = [0, 1];
      this.segmentTangents = [{
        x: 1,
        y: 0
      }];
      this.totalLength = 1;
      return;
    }
    this.points = cleaned;
    const vertexCount = this.points.length;
    const segmentCount = vertexCount - 1;
    const cumulative = new Array(vertexCount).fill(0);
    const tangents = new Array(segmentCount);
    let accumulated = 0;
    for (let i = 0; i < segmentCount; i++) {
      const dx = this.points[i + 1].x - this.points[i].x;
      const dy = this.points[i + 1].y - this.points[i].y;
      const length = Math.hypot(dx, dy);
      const ux = length ? dx / length : 1;
      const uy = length ? dy / length : 0;
      tangents[i] = {
        x: ux,
        y: uy
      };
      accumulated += length;
      cumulative[i + 1] = accumulated;
    }
    this.cumulativeLengths = cumulative;
    this.segmentTangents = tangents;
    this.totalLength = accumulated || 1;
  }
  /**
   * Create a polyline by cloning points (defensive copy).
   * @param points Raw input points; they will be copied and cleaned.
   */
  static from(points) {
    return new _Polyline(points.map((p) => ({
      x: p.x,
      y: p.y
    })));
  }
  /** Remove consecutive duplicate points. */
  static _removeConsecutiveDuplicates(points) {
    const result = [];
    for (const p of points) {
      const last = result[result.length - 1];
      if (!last || last.x !== p.x || last.y !== p.y) {
        result.push({
          x: p.x,
          y: p.y
        });
      }
    }
    return result;
  }
};
var PolylineSampler = class _PolylineSampler {
  _polyline;
  /**
   * @param points Initial points to build the underlying polyline.
   *               You can later call {@link updatePoints} to rebuild.
   */
  constructor(points = []) {
    this._polyline = new Polyline(points);
  }
  /**
   * Rebuild the underlying polyline from new points.
   * @returns Total length of the rebuilt polyline.
   */
  updatePoints(points) {
    this._polyline = new Polyline(points);
    return this._polyline.totalLength;
  }
  /**
   * Backward-compatible alias for older API naming.
   * @returns Total length of the rebuilt polyline.
   */
  calculateTotalLength(points) {
    return this.updatePoints(points);
  }
  /** Total length of the current polyline. */
  get totalLength() {
    return this._polyline.totalLength;
  }
  /**
   * Sample a point by normalized progress along the whole length.
   *
   * - `progress = 0` → start vertex
   * - `progress = 1` → end vertex
   *
   * Uses a small edge threshold (0.5 units) to snap near-start/near-end queries to exact vertices,
   * mirroring the behavior in the original implementation.
   *
   * @param progress Normalized value in [0..1]. Values are clamped to this range.
   * @returns Interpolated point, segment tangent, and whether it was clamped to an edge.
   */
  getPointAtProgress(progress) {
    const {
      points,
      cumulativeLengths,
      segmentTangents,
      totalLength
    } = this._polyline;
    const clamped = _PolylineSampler._clamp(progress, 0, 1);
    const target = clamped * totalLength;
    const edgeThreshold = 0.5;
    if (target <= edgeThreshold) {
      return {
        point: points[0],
        tangent: segmentTangents[0] ?? {
          x: 1,
          y: 0
        },
        atEdge: true
      };
    }
    if (totalLength - target <= edgeThreshold) {
      const last = points.length - 1;
      return {
        point: points[last],
        tangent: segmentTangents[last - 1] ?? {
          x: 1,
          y: 0
        },
        atEdge: true
      };
    }
    const rightIndex = _PolylineSampler._findRightIndex(cumulativeLengths, target);
    const i = Math.max(1, rightIndex);
    const leftLen = cumulativeLengths[i - 1];
    const rightLen = cumulativeLengths[i];
    const t = _PolylineSampler._safeRatio(target - leftLen, rightLen - leftLen);
    const a = points[i - 1];
    const b = points[i];
    const point = {
      x: _PolylineSampler._lerp(a.x, b.x, t),
      y: _PolylineSampler._lerp(a.y, b.y, t)
    };
    const tangent = segmentTangents[i - 1] ?? {
      x: 1,
      y: 0
    };
    return {
      point,
      tangent,
      atEdge: false
    };
  }
  /**
   * Backward-compatible alias.
   * Equivalent to {@link getPointAtProgress}.
   */
  getPointAtLength(progress) {
    return this.getPointAtProgress(progress);
  }
  /**
   * Sample a point by absolute distance from the start (in the same units as your points).
   * This is a convenience wrapper over {@link getPointAtProgress}.
   *
   * @param distance Distance from 0 to {@link totalLength}. Values outside are clamped.
   * @returns Interpolated point, segment tangent, and whether it was clamped to an edge.
   */
  getPointAtDistance(distance) {
    const progress = this._polyline.totalLength ? distance / this._polyline.totalLength : 0;
    return this.getPointAtProgress(progress);
  }
  // =============== Internal utilities ===============
  /** Binary-search the first index where cumulativeLengths[index] >= target. */
  static _findRightIndex(cumulativeLengths, target) {
    let lo = 0;
    let hi = cumulativeLengths.length - 1;
    while (lo < hi) {
      const mid = lo + hi >> 1;
      if (cumulativeLengths[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
  /** Linear interpolation between `a` and `b`. */
  static _lerp(a, b, t) {
    return a + (b - a) * t;
  }
  /** Clamp `value` into [min, max]. */
  static _clamp(value, min, max) {
    return value < min ? min : value > max ? max : value;
  }
  /** Safe ratio `num / den` with tiny-denominator guard. */
  static _safeRatio(num, den) {
    const d = Math.abs(den) < 1e-6 ? 1e-6 : den;
    return num / d;
  }
};
var PolylineContentAlign;
(function(PolylineContentAlign2) {
  PolylineContentAlign2["NONE"] = "none";
  PolylineContentAlign2["ALONG"] = "along";
})(PolylineContentAlign || (PolylineContentAlign = {}));
var PolylineContentPlace = class {
  compute(sampler, content) {
    const progress = this._clamp01(content.position());
    const {
      point,
      tangent
    } = sampler.getPointAtLength(progress);
    const normal = {
      x: -tangent.y,
      y: tangent.x
    };
    const lateral = content.offset() ?? 0;
    const x = point.x + normal.x * lateral;
    const y = point.y + normal.y * lateral;
    const projectedSize = this._sizeAlongDirection(content.hostElement, tangent);
    const halfExtent = projectedSize * 0.5;
    const distanceFromStart = progress * sampler.totalLength;
    const distanceFromEnd = sampler.totalLength - distanceFromStart;
    const position = this._applyEdgeGuard(x, y, tangent, distanceFromStart, distanceFromEnd, halfExtent);
    const rotationDeg = this._calculateContentRotation(content.align(), tangent);
    return {
      position,
      rotationDeg
    };
  }
  _clamp01(v) {
    return v <= 0 ? 0 : v >= 1 ? 1 : v;
  }
  _applyEdgeGuard(x, y, tangent, distanceFromStart, distanceFromEnd, halfExtent) {
    if (distanceFromStart <= halfExtent) {
      const push = halfExtent - distanceFromStart;
      return {
        x: x + tangent.x * push,
        y: y + tangent.y * push
      };
    }
    if (distanceFromEnd <= halfExtent) {
      const push = halfExtent - distanceFromEnd;
      return {
        x: x - tangent.x * push,
        y: y - tangent.y * push
      };
    }
    return {
      x,
      y
    };
  }
  _sizeAlongDirection(element, dir) {
    const rect = RectExtensions.fromElement(element);
    return Math.abs(dir.x) * rect.width + Math.abs(dir.y) * rect.height;
  }
  _normalize180(angleDeg) {
    let a = (angleDeg + 180) % 360;
    if (a < 0) a += 360;
    return a - 180;
  }
  _keepUpright(angleDeg) {
    let a = this._normalize180(angleDeg);
    if (a > 90) a -= 180;
    else if (a < -90) a += 180;
    return a;
  }
  _calculateContentRotation(align, tangent) {
    let result = 0;
    if (align === PolylineContentAlign.ALONG) {
      result = Math.atan2(tangent.y, tangent.x) * 180 / Math.PI;
      result = this._keepUpright(result);
    }
    return result;
  }
};
var ConnectionContentLayoutEngine = class {
  _placement;
  constructor(_placement = new PolylineContentPlace()) {
    this._placement = _placement;
  }
  layout(points, contents) {
    const sampler = new PolylineSampler(points);
    const total = sampler.totalLength;
    for (const item of contents) {
      const {
        position,
        rotationDeg
      } = this._placement.compute(sampler, item);
      item.hostElement.style.transform = this._createTransformString(position, rotationDeg);
    }
    return total;
  }
  _createTransformString(position, rotationDeg) {
    return `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%) rotate(${rotationDeg}deg)`;
  }
};
var FConnectionContent = class _FConnectionContent extends FConnectionContentBase {
  _mediator = inject(FMediator);
  _injector = inject(Injector);
  position = input(0.5, ...ngDevMode ? [{
    debugName: "position",
    transform: (x) => {
      const v = coerceConnectionContentNumber(x);
      return v < 0 ? 0 : v > 1 ? 1 : v;
    }
  }] : [{
    transform: (x) => {
      const v = coerceConnectionContentNumber(x);
      return v < 0 ? 0 : v > 1 ? 1 : v;
    }
  }]);
  offset = input(0, ...ngDevMode ? [{
    debugName: "offset",
    transform: (x) => coerceConnectionContentNumber(x)
  }] : [{
    transform: (x) => coerceConnectionContentNumber(x)
  }]);
  align = input(PolylineContentAlign.NONE, ...ngDevMode ? [{
    debugName: "align",
    transform: (x) => castToEnum(x, "align", PolylineContentAlign)
  }] : [{
    transform: (x) => castToEnum(x, "align", PolylineContentAlign)
  }]);
  ngOnInit() {
    this._listenChanges();
  }
  _listenChanges() {
    effect(() => {
      this.offset();
      this.position();
      this.align();
      untracked(() => this._mediator.execute(new EmitConnectionsChangesRequest()));
    }, {
      injector: this._injector
    });
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFConnectionContent_BaseFactory;
    return function FConnectionContent_Factory(__ngFactoryType__) {
      return (ɵFConnectionContent_BaseFactory || (ɵFConnectionContent_BaseFactory = ɵɵgetInheritedFactory(_FConnectionContent)))(__ngFactoryType__ || _FConnectionContent);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _FConnectionContent,
    selectors: [["", "fConnectionContent", ""]],
    hostAttrs: [1, "f-connection-content"],
    inputs: {
      position: [1, "position"],
      offset: [1, "offset"],
      align: [1, "align"]
    },
    features: [ɵɵProvidersFeature([{
      provide: F_CONNECTION_CONTENT,
      useExisting: _FConnectionContent,
      multi: true
    }]), ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FConnectionContent, [{
    type: Directive,
    args: [{
      selector: "[fConnectionContent]",
      standalone: true,
      host: {
        "class": "f-connection-content"
      },
      providers: [{
        provide: F_CONNECTION_CONTENT,
        useExisting: FConnectionContent,
        multi: true
      }]
    }]
  }], null, {
    position: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "position",
        required: false
      }]
    }],
    offset: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "offset",
        required: false
      }]
    }],
    align: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "align",
        required: false
      }]
    }]
  });
})();
function coerceConnectionContentNumber(value, fallbackValue = 0) {
  return isNumberValue(value) ? Number(value) : fallbackValue;
}
function isNumberValue(value) {
  if (typeof value === "number") {
    return !Number.isNaN(value);
  }
  if (typeof value === "bigint") {
    return true;
  }
  if (typeof value === "string") {
    return value.trim() !== "" && !Number.isNaN(Number(value));
  }
  return false;
}
var F_CONNECTION_WAYPOINTS = new InjectionToken("F_CONNECTION_WAYPOINTS");
var FConnectionWaypointsBase = class {
  hostElement = inject(ElementRef).nativeElement;
  candidates = signal([], ...ngDevMode ? [{
    debugName: "candidates"
  }] : []);
  _activeIndex = 0;
  _waypoints = [];
  insert(candidate) {
    const current = this.waypoints().slice();
    this._activeIndex = Math.max(0, Math.min(this.candidates().indexOf(candidate), current.length));
    current.splice(this._activeIndex, 0, __spreadValues({}, candidate));
    this.waypoints.set(current);
    this._waypoints = current;
  }
  select(waypoint) {
    this._activeIndex = this.waypoints().findIndex((x) => PointExtensions.isEqual(waypoint, x));
    this._waypoints = this.waypoints();
  }
  move(point) {
    this._waypoints[this._activeIndex] = __spreadValues({}, point);
  }
  update() {
    this.waypoints.set([...this._waypoints]);
  }
};
function isPointerInsidePoint(point, circleCenter, radius) {
  return (point.x - circleCenter.x) ** 2 + (point.y - circleCenter.y) ** 2 <= radius ** 2;
}
function findWaypointCandidate(connection, position) {
  const component = connection.fWaypoints();
  const radius = component?.radius() || 8;
  return component?.candidates().find((x) => isPointerInsidePoint(position, x, radius));
}
function findExistingWaypoint(connection, position) {
  const component = connection.fWaypoints();
  const radius = component?.radius() || 8;
  return component?.waypoints().find((x) => isPointerInsidePoint(position, x, radius));
}
function pickWaypoint(connections, position) {
  for (const connection of connections) {
    const waypoint = findExistingWaypoint(connection, position);
    if (waypoint && connection.fWaypoints()?.visibility()) {
      return {
        connection,
        waypoint
      };
    }
    const candidate = findWaypointCandidate(connection, position);
    if (candidate && connection.fWaypoints()?.visibility()) {
      return {
        connection,
        candidate
      };
    }
  }
  return void 0;
}
var F_CONNECTION_COMPONENTS_PARENT = new InjectionToken("F_CONNECTION_COMPONENTS_PARENT");
var FConnectionComponentsParent = class {
};
var FConnectionWaypoints = class _FConnectionWaypoints extends FConnectionWaypointsBase {
  _mediator = inject(FMediator);
  _injector = inject(Injector);
  _connection = inject(F_CONNECTION_COMPONENTS_PARENT);
  radius = input(4, ...ngDevMode ? [{
    debugName: "radius",
    transform: numberAttribute
  }] : [{
    transform: numberAttribute
  }]);
  waypoints = model([], ...ngDevMode ? [{
    debugName: "waypoints"
  }] : []);
  visibility = input(true, ...ngDevMode ? [{
    debugName: "visibility",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]);
  ngOnInit() {
    this._listenChanges();
  }
  _listenChanges() {
    effect(() => {
      this.radius();
      this.waypoints();
      this.visibility();
      untracked(() => this._notifyDataChanged());
    }, {
      injector: this._injector
    });
  }
  _notifyDataChanged() {
    this._mediator.execute(new EmitConnectionsChangesRequest());
  }
  remove(index, event) {
    this._mediator.execute(new RemoveConnectionWaypointRequest(index, this._connection.fId()));
    event.stopPropagation();
    event.preventDefault();
  }
  ngOnDestroy() {
    this._notifyDataChanged();
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFConnectionWaypoints_BaseFactory;
    return function FConnectionWaypoints_Factory(__ngFactoryType__) {
      return (ɵFConnectionWaypoints_BaseFactory || (ɵFConnectionWaypoints_BaseFactory = ɵɵgetInheritedFactory(_FConnectionWaypoints)))(__ngFactoryType__ || _FConnectionWaypoints);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _FConnectionWaypoints,
    selectors: [["f-connection-waypoints"]],
    hostAttrs: [1, "f-component", "f-connection-waypoints"],
    inputs: {
      radius: [1, "radius"],
      waypoints: [1, "waypoints"],
      visibility: [1, "visibility"]
    },
    outputs: {
      waypoints: "waypointsChange"
    },
    features: [ɵɵProvidersFeature([{
      provide: F_CONNECTION_WAYPOINTS,
      useExisting: _FConnectionWaypoints
    }]), ɵɵInheritDefinitionFeature],
    decls: 1,
    vars: 1,
    consts: [["xmlns", "http://www.w3.org/2000/svg"], [1, "f-candidate"], [1, "f-waypoint"], [1, "f-waypoint", 3, "contextmenu"]],
    template: function FConnectionWaypoints_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵtemplate(0, FConnectionWaypoints_Conditional_0_Template, 6, 0, ":svg:svg", 0);
      }
      if (rf & 2) {
        ɵɵconditional(ctx.visibility() ? 0 : -1);
      }
    },
    styles: ["[_nghost-%COMP%]{pointer-events:none;position:absolute}svg[_ngcontent-%COMP%]{display:block;vertical-align:middle;position:absolute;overflow:visible}circle[_ngcontent-%COMP%]{pointer-events:visible}"],
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FConnectionWaypoints, [{
    type: Component,
    args: [{
      selector: "f-connection-waypoints",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        class: "f-component f-connection-waypoints"
      },
      providers: [{
        provide: F_CONNECTION_WAYPOINTS,
        useExisting: FConnectionWaypoints
      }],
      template: '@if (visibility()) {\n  <svg xmlns="http://www.w3.org/2000/svg">\n    <g>\n      @for (candidate of candidates(); track $index) {\n        <circle\n          [attr.r]="radius()"\n          class="f-candidate"\n          [attr.cx]="candidate.x"\n          [attr.cy]="candidate.y"\n        ></circle>\n      }\n      @for (point of waypoints(); track $index) {\n        <circle\n          [attr.r]="radius()"\n          (contextmenu)="remove($index, $event)"\n          class="f-waypoint"\n          [attr.cx]="point.x"\n          [attr.cy]="point.y"\n        ></circle>\n      }\n    </g>\n  </svg>\n}\n\n',
      styles: [":host{pointer-events:none;position:absolute}svg{display:block;vertical-align:middle;position:absolute;overflow:visible}circle{pointer-events:visible}\n"]
    }]
  }], null, {
    radius: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "radius",
        required: false
      }]
    }],
    waypoints: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "waypoints",
        required: false
      }]
    }, {
      type: Output,
      args: ["waypointsChange"]
    }],
    visibility: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "visibility",
        required: false
      }]
    }]
  });
})();
var EFMarkerType;
(function(EFMarkerType2) {
  EFMarkerType2["START"] = "f-connection-marker-start";
  EFMarkerType2["END"] = "f-connection-marker-end";
  EFMarkerType2["SELECTED_START"] = "f-connection-selected-marker-start";
  EFMarkerType2["SELECTED_END"] = "f-connection-selected-marker-end";
  EFMarkerType2["START_ALL_STATES"] = "f-connection-marker-start-all-states";
  EFMarkerType2["END_ALL_STATES"] = "f-connection-marker-end-all-states";
})(EFMarkerType || (EFMarkerType = {}));
var F_CONNECTION_MARKER = new InjectionToken("F_CONNECTION_MARKER");
var uniqueId$c = 0;
var FConnectionMarkerBase = class {
  fId = signal(`f-marker-${uniqueId$c++}`, ...ngDevMode ? [{
    debugName: "fId"
  }] : []);
  hostElement = inject(ElementRef).nativeElement;
};
function coerceMarkerType(value, fallbackValue = EFMarkerType.START) {
  if (typeof value !== "string") {
    return fallbackValue;
  }
  const normalizedValue = value.trim().toLowerCase();
  if (!normalizedValue) {
    return fallbackValue;
  }
  return mapMarkerTypeAlias(normalizedValue) ?? fallbackValue;
}
function mapMarkerTypeAlias(value) {
  switch (value) {
    case "start":
    case "f-connection-marker-start":
      return EFMarkerType.START;
    case "end":
    case "f-connection-marker-end":
      return EFMarkerType.END;
    case "selected-start":
    case "f-connection-selected-marker-start":
      return EFMarkerType.SELECTED_START;
    case "selected-end":
    case "f-connection-selected-marker-end":
      return EFMarkerType.SELECTED_END;
    case "start-all-states":
    case "f-connection-marker-start-all-states":
    case "start-all":
    case "all-start":
      return EFMarkerType.START_ALL_STATES;
    case "end-all-states":
    case "f-connection-marker-end-all-states":
    case "end-all":
    case "all-end":
      return EFMarkerType.END_ALL_STATES;
    default:
      return null;
  }
}
var FConnectionMarkerArrow = class _FConnectionMarkerArrow extends FConnectionMarkerBase {
  _markerElement = viewChild.required("markerElement");
  _type = input(EFMarkerType.END_ALL_STATES, ...ngDevMode ? [{
    debugName: "_type",
    alias: "type",
    transform: (value) => coerceMarkerType(value, EFMarkerType.END_ALL_STATES)
  }] : [{
    alias: "type",
    transform: (value) => coerceMarkerType(value, EFMarkerType.END_ALL_STATES)
  }]);
  get markerElement() {
    return this._markerElement().nativeElement;
  }
  width = 6;
  height = 7;
  refX = 5.5;
  refY = 3.5;
  get type() {
    return this._type();
  }
  orient = "auto";
  markerUnits = "strokeWidth";
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFConnectionMarkerArrow_BaseFactory;
    return function FConnectionMarkerArrow_Factory(__ngFactoryType__) {
      return (ɵFConnectionMarkerArrow_BaseFactory || (ɵFConnectionMarkerArrow_BaseFactory = ɵɵgetInheritedFactory(_FConnectionMarkerArrow)))(__ngFactoryType__ || _FConnectionMarkerArrow);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _FConnectionMarkerArrow,
    selectors: [["f-connection-marker-arrow"]],
    viewQuery: function FConnectionMarkerArrow_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuerySignal(ctx._markerElement, _c0, 5);
      }
      if (rf & 2) {
        ɵɵqueryAdvance();
      }
    },
    hostAttrs: [1, "f-component", 2, "display", "none"],
    inputs: {
      _type: [1, "type", "_type"]
    },
    features: [ɵɵProvidersFeature([{
      provide: F_CONNECTION_MARKER,
      useExisting: _FConnectionMarkerArrow
    }]), ɵɵInheritDefinitionFeature],
    decls: 3,
    vars: 0,
    consts: [["markerElement", ""], ["viewBox", "0 0 6 6", 1, "f-marker"], ["d", "M0,0 L6,3 0,6Z"]],
    template: function FConnectionMarkerArrow_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵnamespaceSVG();
        ɵɵelementStart(0, "svg", 1, 0);
        ɵɵelement(2, "path", 2);
        ɵɵelementEnd();
      }
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FConnectionMarkerArrow, [{
    type: Component,
    args: [{
      selector: "f-connection-marker-arrow",
      standalone: true,
      template: `
    <svg #markerElement viewBox="0 0 6 6" class="f-marker">
      <svg:path d="M0,0 L6,3 0,6Z" />
    </svg>
  `,
      host: {
        class: "f-component",
        style: "display: none;"
      },
      providers: [{
        provide: F_CONNECTION_MARKER,
        useExisting: FConnectionMarkerArrow
      }]
    }]
  }], null, {
    _markerElement: [{
      type: ViewChild,
      args: ["markerElement", {
        isSignal: true
      }]
    }],
    _type: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "type",
        required: false
      }]
    }]
  });
})();
var FConnectionMarkerCircle = class _FConnectionMarkerCircle extends FConnectionMarkerBase {
  _markerElement = viewChild.required("markerElement");
  _type = input(EFMarkerType.START_ALL_STATES, ...ngDevMode ? [{
    debugName: "_type",
    alias: "type",
    transform: (value) => coerceMarkerType(value, EFMarkerType.START_ALL_STATES)
  }] : [{
    alias: "type",
    transform: (value) => coerceMarkerType(value, EFMarkerType.START_ALL_STATES)
  }]);
  get markerElement() {
    return this._markerElement().nativeElement;
  }
  width = 5;
  height = 5;
  refX = 2.5;
  refY = 2.5;
  get type() {
    return this._type();
  }
  orient = "auto";
  markerUnits = "strokeWidth";
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFConnectionMarkerCircle_BaseFactory;
    return function FConnectionMarkerCircle_Factory(__ngFactoryType__) {
      return (ɵFConnectionMarkerCircle_BaseFactory || (ɵFConnectionMarkerCircle_BaseFactory = ɵɵgetInheritedFactory(_FConnectionMarkerCircle)))(__ngFactoryType__ || _FConnectionMarkerCircle);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _FConnectionMarkerCircle,
    selectors: [["f-connection-marker-circle"]],
    viewQuery: function FConnectionMarkerCircle_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuerySignal(ctx._markerElement, _c0, 5);
      }
      if (rf & 2) {
        ɵɵqueryAdvance();
      }
    },
    hostAttrs: [1, "f-component", 2, "display", "none"],
    inputs: {
      _type: [1, "type", "_type"]
    },
    features: [ɵɵProvidersFeature([{
      provide: F_CONNECTION_MARKER,
      useExisting: _FConnectionMarkerCircle
    }]), ɵɵInheritDefinitionFeature],
    decls: 3,
    vars: 0,
    consts: [["markerElement", ""], ["viewBox", "0 0 10 10", 1, "f-marker"], ["cx", "5", "cy", "5", "r", "5"]],
    template: function FConnectionMarkerCircle_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵnamespaceSVG();
        ɵɵelementStart(0, "svg", 1, 0);
        ɵɵelement(2, "circle", 2);
        ɵɵelementEnd();
      }
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FConnectionMarkerCircle, [{
    type: Component,
    args: [{
      selector: "f-connection-marker-circle",
      standalone: true,
      template: `
    <svg #markerElement viewBox="0 0 10 10" class="f-marker">
      <svg:circle cx="5" cy="5" r="5" />
    </svg>
  `,
      host: {
        class: "f-component",
        style: "display: none;"
      },
      providers: [{
        provide: F_CONNECTION_MARKER,
        useExisting: FConnectionMarkerCircle
      }]
    }]
  }], null, {
    _markerElement: [{
      type: ViewChild,
      args: ["markerElement", {
        isSignal: true
      }]
    }],
    _type: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "type",
        required: false
      }]
    }]
  });
})();
var FConnectionMarker = class _FConnectionMarker extends FConnectionMarkerBase {
  _mediator = inject(FMediator);
  markerElement = this.hostElement;
  width = 0;
  height = 0;
  refX = 0;
  refY = 0;
  type = EFMarkerType.START;
  orient = "auto";
  markerUnits = "strokeWidth";
  ngOnInit() {
    this.hostElement.style.display = "none";
    this._mediator.execute(new AddConnectionMarkerToStoreRequest(this));
  }
  ngOnDestroy() {
    this._mediator.execute(new RemoveConnectionMarkerFromStoreRequest(this));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFConnectionMarker_BaseFactory;
    return function FConnectionMarker_Factory(__ngFactoryType__) {
      return (ɵFConnectionMarker_BaseFactory || (ɵFConnectionMarker_BaseFactory = ɵɵgetInheritedFactory(_FConnectionMarker)))(__ngFactoryType__ || _FConnectionMarker);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _FConnectionMarker,
    selectors: [["svg", "fMarker", ""]],
    hostAttrs: [1, "f-component", "f-marker"],
    inputs: {
      width: "width",
      height: "height",
      refX: "refX",
      refY: "refY",
      type: [2, "type", "type", (value) => coerceMarkerType(value, EFMarkerType.START)],
      orient: "orient",
      markerUnits: "markerUnits"
    },
    standalone: false,
    features: [ɵɵProvidersFeature([{
      provide: F_CONNECTION_MARKER,
      useExisting: _FConnectionMarker
    }]), ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FConnectionMarker, [{
    type: Directive,
    args: [{
      standalone: false,
      selector: "svg[fMarker]",
      host: {
        class: "f-component f-marker"
      },
      providers: [{
        provide: F_CONNECTION_MARKER,
        useExisting: FConnectionMarker
      }]
    }]
  }], null, {
    width: [{
      type: Input
    }],
    height: [{
      type: Input
    }],
    refX: [{
      type: Input
    }],
    refY: [{
      type: Input
    }],
    type: [{
      type: Input,
      args: [{
        transform: (value) => coerceMarkerType(value, EFMarkerType.START)
      }]
    }],
    orient: [{
      type: Input
    }],
    markerUnits: [{
      type: Input
    }]
  });
})();
var EFConnectionBehavior;
(function(EFConnectionBehavior2) {
  EFConnectionBehavior2["FIXED"] = "fixed";
  EFConnectionBehavior2["FIXED_CENTER"] = "fixed_center";
  EFConnectionBehavior2["FLOATING"] = "floating";
})(EFConnectionBehavior || (EFConnectionBehavior = {}));
var EFConnectionConnectableSide;
(function(EFConnectionConnectableSide2) {
  EFConnectionConnectableSide2["DEFAULT"] = "default";
  EFConnectionConnectableSide2["TOP"] = "top";
  EFConnectionConnectableSide2["BOTTOM"] = "bottom";
  EFConnectionConnectableSide2["LEFT"] = "left";
  EFConnectionConnectableSide2["RIGHT"] = "right";
  EFConnectionConnectableSide2["CALCULATE"] = "calculate";
  EFConnectionConnectableSide2["CALCULATE_HORIZONTAL"] = "calculate_horizontal";
  EFConnectionConnectableSide2["CALCULATE_VERTICAL"] = "calculate_vertical";
})(EFConnectionConnectableSide || (EFConnectionConnectableSide = {}));
function fixedCenterBehavior({
  sourceRect,
  targetRect
}) {
  return {
    point1: sourceRect.gravityCenter,
    point2: targetRect.gravityCenter
  };
}
var EFConnectableSide;
(function(EFConnectableSide2) {
  EFConnectableSide2["LEFT"] = "left";
  EFConnectableSide2["TOP"] = "top";
  EFConnectableSide2["RIGHT"] = "right";
  EFConnectableSide2["BOTTOM"] = "bottom";
  EFConnectableSide2["CALCULATE"] = "calculate";
  EFConnectableSide2["CALCULATE_HORIZONTAL"] = "calculate_horizontal";
  EFConnectableSide2["CALCULATE_VERTICAL"] = "calculate_vertical";
  EFConnectableSide2["AUTO"] = "auto";
})(EFConnectableSide || (EFConnectableSide = {}));
var EFConnectionType;
(function(EFConnectionType2) {
  EFConnectionType2["SEGMENT"] = "segment";
  EFConnectionType2["STRAIGHT"] = "straight";
  EFConnectionType2["BEZIER"] = "bezier";
  EFConnectionType2["ADAPTIVE_CURVE"] = "adaptive-curve";
})(EFConnectionType || (EFConnectionType = {}));
function fixedOutboundBehavior({
  sourceRect,
  sourceConnectableSide,
  targetRect,
  targetConnectableSide
}) {
  return {
    point1: _getPosition(sourceRect, sourceConnectableSide === EFConnectableSide.AUTO ? EFConnectableSide.BOTTOM : sourceConnectableSide),
    point2: _getPosition(targetRect, targetConnectableSide === EFConnectableSide.AUTO ? EFConnectableSide.TOP : targetConnectableSide)
  };
}
function _getPosition(rect, side) {
  switch (side) {
    case EFConnectableSide.TOP:
      return {
        x: rect.x + rect.width / 2,
        y: rect.y
      };
    case EFConnectableSide.BOTTOM:
      return {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height
      };
    case EFConnectableSide.LEFT:
      return {
        x: rect.x,
        y: rect.y + rect.height / 2
      };
    case EFConnectableSide.RIGHT:
      return {
        x: rect.x + rect.width,
        y: rect.y + rect.height / 2
      };
    default:
      throw new Error(`Unknown side: ${side}`);
  }
}
function getRotatedRoundedRectIntersection(from, to, rect, rotationContext) {
  if (!rotationContext || !rotationContext.rotationDeg) {
    return GetIntersections.getRoundedRectIntersections(from, to, rect)[0];
  }
  const localFrom = _rotatePoint(from, -rotationContext.rotationDeg, rotationContext.pivot);
  const localTo = _rotatePoint(to, -rotationContext.rotationDeg, rotationContext.pivot);
  const localRect = _rotateRect(rect, -rotationContext.rotationDeg, rotationContext.pivot);
  const intersection = GetIntersections.getRoundedRectIntersections(localFrom, localTo, localRect)[0];
  return intersection ? _rotatePoint(intersection, rotationContext.rotationDeg, rotationContext.pivot) : void 0;
}
function _rotateRect(rect, rotationDeg, pivot) {
  const center = _rotatePoint(_getRectCenter(rect), rotationDeg, pivot);
  return new RoundedRect(center.x - rect.width / 2, center.y - rect.height / 2, rect.width, rect.height, rect.radius1, rect.radius2, rect.radius3, rect.radius4);
}
function _getRectCenter(rect) {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2
  };
}
function _rotatePoint(point, rotationDeg, pivot) {
  const translatedX = point.x - pivot.x;
  const translatedY = point.y - pivot.y;
  const theta = rotationDeg * Math.PI / 180;
  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sin(theta);
  return {
    x: translatedX * cosTheta - translatedY * sinTheta + pivot.x,
    y: translatedX * sinTheta + translatedY * cosTheta + pivot.y
  };
}
function floatingBehavior({
  sourceRect,
  targetRect,
  sourceRotationContext,
  targetRotationContext
}) {
  return _getIntersectionsLine(_fromRoundedRectIntersections(sourceRect, targetRect, sourceRotationContext), _toRoundedRectIntersections(sourceRect, targetRect, targetRotationContext), sourceRect, targetRect);
}
function _fromRoundedRectIntersections(sourceRect, targetRect, rotationContext) {
  return getRotatedRoundedRectIntersection(sourceRect.gravityCenter, targetRect.gravityCenter, sourceRect, rotationContext);
}
function _toRoundedRectIntersections(sourceRect, targetRect, rotationContext) {
  return getRotatedRoundedRectIntersection(targetRect.gravityCenter, sourceRect.gravityCenter, targetRect, rotationContext);
}
function _getIntersectionsLine(from, to, sourceRect, targetRect) {
  return {
    point1: from ? from : sourceRect.gravityCenter,
    point2: to ? to : targetRect.gravityCenter
  };
}
var EPSILON = 0.5;
var BEHAVIOR_HANDLERS = {
  [EFConnectionBehavior.FLOATING]: floatingBehavior,
  [EFConnectionBehavior.FIXED_CENTER]: fixedCenterBehavior,
  [EFConnectionBehavior.FIXED]: fixedOutboundBehavior
};
var ConnectionBehaviourBuilder = class _ConnectionBehaviourBuilder {
  /**
   * Main execution entry point.
   *
   * @param request The request containing source, target, and connection details.
   * @returns A calculated connection line (ILine).
   */
  handle(request) {
    const vectors = this._calculateDirectionalVectors(request.sourceRect.gravityCenter.x, request.sourceRect.gravityCenter.y, request.targetRect.gravityCenter.x, request.targetRect.gravityCenter.y);
    const sourceSide = this._determineSourceSide(request, vectors);
    const targetSide = this._determineTargetSide(request, vectors);
    request.connection._applyResolvedSidesToConnection(sourceSide, targetSide);
    const handler = this._getBehaviorHandler(request.connection.fBehavior);
    return handler({
      sourceRect: request.sourceRect,
      targetRect: request.targetRect,
      sourceConnectableSide: sourceSide,
      targetConnectableSide: targetSide,
      sourceRotationContext: request.sourceRotationContext,
      targetRotationContext: request.targetRotationContext
    });
  }
  /**
   * Computes the directional deltas between two rectangles.
   */
  _calculateDirectionalVectors(sourceX, sourceY, targetX, targetY) {
    const sourceToTargetX = targetX - sourceX;
    const sourceToTargetY = targetY - sourceY;
    return {
      sourceToTargetX,
      sourceToTargetY,
      targetToSourceX: -sourceToTargetX,
      targetToSourceY: -sourceToTargetY
    };
  }
  /**
   * Determines the side for the source element.
   */
  _determineSourceSide(request, vectors) {
    return this._resolveConnectableSide(request.connection.fOutputSide(), vectors.sourceToTargetX, vectors.sourceToTargetY, request.sourceConnectableSide);
  }
  /**
   * Determines the side for the target element.
   */
  _determineTargetSide(request, vectors) {
    return this._resolveConnectableSide(request.connection.fInputSide(), vectors.targetToSourceX, vectors.targetToSourceY, request.targetConnectableSide);
  }
  /**
   * Resolves which side of a shape to connect to based on direction, fallback, and connection mode.
   *
   * @param requestedSide The side mode (e.g. CALCULATE, CALCULATE_HORIZONTAL, FIXED, etc.).
   * @param deltaX Difference in X between source and target.
   * @param deltaY Difference in Y between source and target.
   * @param fallbackSide The default fallback side if calculation is ambiguous.
   */
  _resolveConnectableSide(requestedSide, deltaX, deltaY, fallbackSide) {
    if (requestedSide === EFConnectionConnectableSide.DEFAULT) {
      return fallbackSide;
    }
    const absoluteX = Math.abs(deltaX);
    const absoluteY = Math.abs(deltaY);
    const isNearZero = absoluteX < EPSILON && absoluteY < EPSILON;
    if (isNearZero) {
      return fallbackSide;
    }
    const isHorizontalDominant = absoluteX >= absoluteY;
    switch (requestedSide) {
      case EFConnectionConnectableSide.CALCULATE:
        return isHorizontalDominant ? deltaX >= 0 ? EFConnectableSide.RIGHT : EFConnectableSide.LEFT : deltaY >= 0 ? EFConnectableSide.BOTTOM : EFConnectableSide.TOP;
      case EFConnectionConnectableSide.CALCULATE_HORIZONTAL:
        if (absoluteX < EPSILON) {
          return fallbackSide;
        }
        return deltaX >= 0 ? EFConnectableSide.RIGHT : EFConnectableSide.LEFT;
      case EFConnectionConnectableSide.CALCULATE_VERTICAL:
        if (absoluteY < EPSILON) {
          return fallbackSide;
        }
        return deltaY >= 0 ? EFConnectableSide.BOTTOM : EFConnectableSide.TOP;
      case EFConnectionConnectableSide.TOP:
        return EFConnectableSide.TOP;
      case EFConnectionConnectableSide.BOTTOM:
        return EFConnectableSide.BOTTOM;
      case EFConnectionConnectableSide.LEFT:
        return EFConnectableSide.LEFT;
      case EFConnectionConnectableSide.RIGHT:
        return EFConnectableSide.RIGHT;
      default:
        return fallbackSide;
    }
  }
  /**
   * Returns the appropriate handler for the given connection behavior.
   *
   * @throws Error if no handler is registered for the behavior.
   */
  _getBehaviorHandler(behavior) {
    const handler = BEHAVIOR_HANDLERS[behavior];
    if (!handler) {
      throw new Error(`[Behavior] No handler for behavior: ${behavior}`);
    }
    return handler;
  }
  static ɵfac = function ConnectionBehaviourBuilder_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ConnectionBehaviourBuilder)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ConnectionBehaviourBuilder,
    factory: _ConnectionBehaviourBuilder.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ConnectionBehaviourBuilder, [{
    type: Injectable
  }], null, null);
})();
var ConnectionBehaviourBuilderRequest = class {
  sourceRect;
  targetRect;
  connection;
  sourceConnectableSide;
  targetConnectableSide;
  sourceRotationContext;
  targetRotationContext;
  constructor(sourceRect, targetRect, connection, sourceConnectableSide, targetConnectableSide, sourceRotationContext, targetRotationContext) {
    this.sourceRect = sourceRect;
    this.targetRect = targetRect;
    this.connection = connection;
    this.sourceConnectableSide = sourceConnectableSide;
    this.targetConnectableSide = targetConnectableSide;
    this.sourceRotationContext = sourceRotationContext;
    this.targetRotationContext = targetRotationContext;
  }
};
function buildConnectionAnchors(source, target, waypoints) {
  return [source, ...waypoints ?? [], target];
}
function calculateCenterBetweenPoints(source, target) {
  const offsetX = Math.abs(target.x - source.x) / 2;
  const centerX = target.x < source.x ? target.x + offsetX : target.x - offsetX;
  const offsetY = Math.abs(target.y - source.y) / 2;
  const centerY = target.y < source.y ? target.y + offsetY : target.y - offsetY;
  return {
    x: centerX,
    y: centerY
  };
}
function sampleCubicBezierUniform(points, samples = 32) {
  const out = new Array(samples + 1);
  out[0] = __spreadValues({}, points[0]);
  for (let i = 1; i <= samples; i++) {
    out[i] = cubicBezierAtT(points[0], points[1], points[2], points[3], i / samples);
  }
  return out;
}
function cubicBezierAtT(p0, p1, p2, p3, t) {
  const u = 1 - t, tt = t * t, uu = u * u, uuu = uu * u, ttt = tt * t;
  return {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y
  };
}
function calculateCurveCandidates(segments) {
  return segments.map((s) => {
    return cubicBezierAtT(s.p0, s.c1, s.c2, s.p3, 0.5);
  });
}
function calculatePolylineCandidates(polyline) {
  if (polyline.length < 2) {
    throw new Error("Polylines must be at least two points");
  }
  const total = polylineTotalLength(polyline);
  if (total <= 0) {
    return [__spreadValues({}, polyline[0])];
  }
  const mid = pointAtPolylineLength(polyline, total / 2);
  return [mid];
}
function polylineTotalLength(points) {
  let len = 0;
  for (let i = 0; i < points.length - 1; i++) {
    len += dist(points[i], points[i + 1]);
  }
  return len;
}
function pointAtPolylineLength(points, s) {
  let acc = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const segLen = dist(a, b);
    if (segLen <= 0) continue;
    if (acc + segLen >= s) {
      const t = (s - acc) / segLen;
      return {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t
      };
    }
    acc += segLen;
  }
  const last = points[points.length - 1];
  return {
    x: last.x,
    y: last.y
  };
}
function dist(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}
function mergePointChains(chains) {
  const out = [];
  for (const chain of chains) {
    for (const p of chain) {
      const last = out[out.length - 1];
      if (!last || last.x !== p.x || last.y !== p.y) out.push(p);
    }
  }
  return out;
}
function createMultiCubicPath(segments) {
  if (!segments.length) return "";
  let d = `M ${segments[0].p0.x} ${segments[0].p0.y}`;
  for (let i = 0; i < segments.length; i++) {
    const s = segments[i];
    const isLast = i === segments.length - 1;
    const x = isLast ? s.p3.x + 2e-4 : s.p3.x;
    const y = isLast ? s.p3.y + 2e-4 : s.p3.y;
    d += ` C ${s.c1.x} ${s.c1.y}, ${s.c2.x} ${s.c2.y}, ${x} ${y}`;
  }
  return d;
}
function sampleMultiCubicUniform(segments, samplesPerSegment = 16) {
  if (!segments.length) return [];
  const out = [];
  for (let i = 0; i < segments.length; i++) {
    const s = segments[i];
    const pts = sampleCubicBezierUniform([s.p0, s.c1, s.c2, s.p3], samplesPerSegment);
    if (i > 0) pts.shift();
    out.push(...pts);
  }
  return out;
}
function normalizePolyline(points, eps = 1e-6) {
  const n = points.length;
  if (n <= 2) return points;
  const tmp = [];
  tmp.push(points[0]);
  for (let i = 1; i < n; i++) {
    const p = points[i];
    const last = tmp[tmp.length - 1];
    if (Math.abs(p.x - last.x) > eps || Math.abs(p.y - last.y) > eps) {
      tmp.push(p);
    }
  }
  if (tmp.length <= 2) return tmp;
  const out = [];
  out.push(tmp[0]);
  for (let i = 1; i < tmp.length - 1; i++) {
    const a = out[out.length - 1];
    const b = tmp[i];
    const c = tmp[i + 1];
    const collinearX = Math.abs(a.x - b.x) <= eps && Math.abs(b.x - c.x) <= eps;
    const collinearY = Math.abs(a.y - b.y) <= eps && Math.abs(b.y - c.y) <= eps;
    if (!collinearX && !collinearY) out.push(b);
  }
  out.push(tmp[tmp.length - 1]);
  return out;
}
var CalculateAdaptiveCurveData = class _CalculateAdaptiveCurveData {
  static _dir(side) {
    switch (side) {
      case EFConnectableSide.LEFT:
        return {
          x: -1,
          y: 0
        };
      case EFConnectableSide.RIGHT:
        return {
          x: 1,
          y: 0
        };
      case EFConnectableSide.TOP:
        return {
          x: 0,
          y: -1
        };
      case EFConnectableSide.BOTTOM:
        return {
          x: 0,
          y: 1
        };
      case EFConnectableSide.AUTO:
        return {
          x: 0,
          y: 0
        };
    }
    return {
      x: 0,
      y: 0
    };
  }
  static _isHorizontal(side) {
    return side === EFConnectableSide.LEFT || side === EFConnectableSide.RIGHT;
  }
  static _handleLength(p0, p3, side, offset) {
    const dx = Math.abs(p3.x - p0.x);
    const dy = Math.abs(p3.y - p0.y);
    const d = Math.hypot(dx, dy);
    const along = side === EFConnectableSide.AUTO ? Math.max(dx, dy) : this._isHorizontal(side) ? dx : dy;
    const MIN = Math.max(8, offset);
    const MAX = offset + 0.5 * d;
    const len = offset * 1.05 + along * 0.3;
    return Math.min(MAX, Math.max(MIN, len));
  }
  static _softControl(side, source, target, handle) {
    const v = this._dir(side);
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const dist2 = Math.hypot(dx, dy) || 1;
    const tx = dx / dist2;
    const ty = dy / dist2;
    if (side === EFConnectableSide.AUTO) {
      return {
        x: source.x + tx * handle,
        y: source.y + ty * handle
      };
    }
    const dot = v.x * tx + v.y * ty;
    const baseBlend = 0.12;
    const extra = Math.max(0, -dot) * 0.08;
    const blend = Math.min(0.2, baseBlend + extra);
    const dirX = v.x * (1 - blend) + tx * blend;
    const dirY = v.y * (1 - blend) + ty * blend;
    const len = Math.hypot(dirX, dirY) || 1;
    return {
      x: source.x + dirX / len * handle,
      y: source.y + dirY / len * handle
    };
  }
  handle({
    source,
    sourceSide,
    target,
    targetSide,
    offset,
    waypoints
  }) {
    const clampedOffset = Math.max(0, offset ?? 0);
    const anchors = buildConnectionAnchors(source, target, waypoints);
    const segments = [];
    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i];
      const b = anchors[i + 1];
      const h0 = _CalculateAdaptiveCurveData._handleLength(a, b, sourceSide, clampedOffset);
      const h3 = _CalculateAdaptiveCurveData._handleLength(b, a, targetSide, clampedOffset);
      const c1 = _CalculateAdaptiveCurveData._softControl(sourceSide, a, b, h0);
      const c2 = _CalculateAdaptiveCurveData._softControl(targetSide, b, a, h3);
      segments.push({
        p0: a,
        c1,
        c2,
        p3: b,
        chainIndex: i
      });
    }
    const points = sampleMultiCubicUniform(segments, 12);
    return {
      path: createMultiCubicPath(segments),
      secondPoint: segments[0]?.c1 ?? source,
      penultimatePoint: segments[segments.length - 1]?.c2 ?? target,
      points,
      candidates: calculateCurveCandidates(segments)
    };
  }
};
var CalculateBezierCurveData = class {
  handle({
    source,
    sourceSide,
    target,
    targetSide,
    offset,
    waypoints
  }) {
    const anchors = buildConnectionAnchors(source, target, waypoints);
    const segments = [];
    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i];
      const b = anchors[i + 1];
      const c1 = getAnglePoint(sourceSide, a, b, offset ?? 0);
      const c2 = getAnglePoint(targetSide, b, a, offset ?? 0);
      segments.push({
        p0: a,
        c1,
        c2,
        p3: b,
        chainIndex: i
      });
    }
    const points = sampleMultiCubicUniform(segments, 12);
    return {
      path: createMultiCubicPath(segments),
      secondPoint: segments[0]?.c1 ?? source,
      penultimatePoint: segments[segments.length - 1]?.c2 ?? target,
      points,
      candidates: calculateCurveCandidates(segments)
    };
  }
};
function getAnglePoint(side, source, target, offset) {
  const result = {
    x: source.x,
    y: source.y
  };
  switch (side) {
    case EFConnectableSide.LEFT:
      result.x -= getConnectorOffset(source.x - target.x, offset);
      break;
    case EFConnectableSide.RIGHT:
      result.x += getConnectorOffset(target.x - source.x, offset);
      break;
    case EFConnectableSide.TOP:
      result.y -= getConnectorOffset(source.y - target.y, offset);
      break;
    case EFConnectableSide.BOTTOM:
      result.y += getConnectorOffset(target.y - source.y, offset);
      break;
    case EFConnectableSide.AUTO:
      break;
  }
  return result;
}
function getConnectorOffset(distance, offset) {
  if (distance >= offset) return distance;
  return offset * Math.sqrt(offset - distance);
}
function buildCornerMidPointsAndApplyOffsets(params) {
  const {
    axis,
    source,
    target,
    sourceSide,
    targetSide,
    sourceGap,
    targetGap,
    sourceDir,
    targetDir,
    currentDir,
    offset,
    sourceGapOffset,
    targetGapOffset
  } = params;
  const corners = buildCornerPoints(sourceGap, targetGap);
  let midPoints = pickCornerByDirection(axis, sourceDir, currentDir, corners);
  if (sourceSide === targetSide) {
    applySameSideGapOffsetFix(axis, source, target, offset, sourceDir, currentDir, sourceGap, targetGap, sourceGapOffset, targetGapOffset);
  } else {
    midPoints = maybeFlipCornerForDifferentSides(axis, sourceDir, targetDir, sourceGap, targetGap, corners, midPoints);
  }
  return midPoints;
}
function buildCornerPoints(sourceGap, targetGap) {
  return {
    sourceTarget: [{
      x: sourceGap.x,
      y: targetGap.y
    }],
    targetSource: [{
      x: targetGap.x,
      y: sourceGap.y
    }]
  };
}
function pickCornerByDirection(axis, sourceDir, currentDir, corners) {
  if (axis === "x") {
    return sourceDir.x === currentDir ? corners.targetSource : corners.sourceTarget;
  }
  return sourceDir.y === currentDir ? corners.sourceTarget : corners.targetSource;
}
function applySameSideGapOffsetFix(axis, source, target, offset, sourceDir, currentDir, sourceGap, targetGap, sourceGapOffset, targetGapOffset) {
  const diff = Math.abs(source[axis] - target[axis]);
  if (diff > offset) return;
  const gapOffset = Math.min(offset - 1, offset - diff);
  if (gapOffset <= 0) return;
  if (sourceDir[axis] === currentDir) {
    sourceGapOffset[axis] = (sourceGap[axis] > source[axis] ? -1 : 1) * gapOffset;
  } else {
    targetGapOffset[axis] = (targetGap[axis] > target[axis] ? -1 : 1) * gapOffset;
  }
}
function maybeFlipCornerForDifferentSides(axis, sourceDir, targetDir, sourceGap, targetGap, corners, currentPicked) {
  const opp = axis === "x" ? "y" : "x";
  const isSameDir = sourceDir[axis] === targetDir[opp];
  const sourceGt = sourceGap[opp] > targetGap[opp];
  const sourceLt = sourceGap[opp] < targetGap[opp];
  const flip = sourceDir[axis] === 1 && (!isSameDir && sourceGt || isSameDir && sourceLt) || sourceDir[axis] !== 1 && (!isSameDir && sourceLt || isSameDir && sourceGt);
  if (!flip) return currentPicked;
  return axis === "x" ? corners.sourceTarget : corners.targetSource;
}
var EPS$1 = 1e-6;
var END_EPS = 2e-4;
var MIN_VISIBLE = 0.75;
function createSegmentLinePath(points, borderRadius) {
  const n = points.length;
  const parts = [];
  parts.push(`M ${points[0].x} ${points[0].y}`);
  for (let i = 1; i < n - 1; i++) {
    parts.push(getBend(points[i - 1], points[i], points[i + 1], borderRadius));
  }
  const last = points[n - 1];
  parts.push(`L ${last.x + END_EPS} ${last.y + END_EPS}`);
  return parts.join(" ");
}
function getBend(a, b, c, size) {
  const x = b.x;
  const y = b.y;
  if (size <= 0) {
    return `L ${x} ${y}`;
  }
  const collinearX = Math.abs(a.x - x) <= EPS$1 && Math.abs(x - c.x) <= EPS$1;
  const collinearY = Math.abs(a.y - y) <= EPS$1 && Math.abs(y - c.y) <= EPS$1;
  if (collinearX || collinearY) {
    return `L ${x} ${y}`;
  }
  const ab = Math.hypot(x - a.x, y - a.y);
  const bc = Math.hypot(c.x - x, c.y - y);
  const bendSize = Math.min(ab * 0.5, bc * 0.5, size);
  if (bendSize < MIN_VISIBLE) {
    return `L ${x} ${y}`;
  }
  const incomingHorizontal = Math.abs(a.y - y) <= EPS$1;
  if (incomingHorizontal) {
    const xDir2 = a.x < c.x ? -1 : 1;
    const yDir2 = a.y < c.y ? 1 : -1;
    const lx = x + bendSize * xDir2;
    const qy = y + bendSize * yDir2;
    return `L ${lx} ${y} Q ${x} ${y} ${x} ${qy}`;
  }
  const xDir = a.x < c.x ? 1 : -1;
  const yDir = a.y < c.y ? -1 : 1;
  const ly = y + bendSize * yDir;
  const qx = x + bendSize * xDir;
  return `L ${x} ${ly} Q ${x} ${y} ${qx} ${y}`;
}
var CONNECTOR_SIDE_POINT = {
  [EFConnectableSide.LEFT]: PointExtensions.initialize(-1, 0),
  [EFConnectableSide.RIGHT]: PointExtensions.initialize(1, 0),
  [EFConnectableSide.TOP]: PointExtensions.initialize(0, -1),
  [EFConnectableSide.BOTTOM]: PointExtensions.initialize(0, 1),
  [EFConnectableSide.AUTO]: PointExtensions.initialize(0, 0)
};
var CalculateSegmentLineData = class {
  handle({
    source,
    sourceSide,
    target,
    targetSide,
    waypoints,
    offset,
    radius
  }) {
    const anchors = buildConnectionAnchors(source, target, waypoints);
    const chains = [];
    const candidates = [];
    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i];
      const b = anchors[i + 1];
      const points = this._getPathPoints(a, sourceSide, b, targetSide, offset ?? 0);
      chains.push(points);
      candidates.push(...calculatePolylineCandidates(points));
    }
    const polyline = normalizePolyline(mergePointChains(chains));
    const penultimatePoint = polyline.length > 1 ? polyline[polyline.length - 2] : source;
    const secondPoint = polyline.length > 1 ? polyline[1] : target;
    return {
      path: createSegmentLinePath(polyline, radius ?? 0),
      penultimatePoint,
      secondPoint,
      points: polyline,
      candidates
    };
  }
  _getPathPoints(source, sourceSide, target, targetSide, offset) {
    const sourceDirection = CONNECTOR_SIDE_POINT[sourceSide];
    const targetDirection = CONNECTOR_SIDE_POINT[targetSide];
    const sourceGap = {
      x: source.x + sourceDirection.x * offset,
      y: source.y + sourceDirection.y * offset
    };
    const targetGap = {
      x: target.x + targetDirection.x * offset,
      y: target.y + targetDirection.y * offset
    };
    const direction = this._getDirection(sourceGap, sourceSide, targetGap);
    const directionAccessor = direction.x !== 0 ? "x" : "y";
    const currentDirection = direction[directionAccessor];
    let points = [];
    const sourceGapOffset = PointExtensions.initialize();
    const targetGapOffset = PointExtensions.initialize();
    const centerBetweenPoints = calculateCenterBetweenPoints(source, target);
    if (sourceDirection[directionAccessor] * targetDirection[directionAccessor] === -1) {
      const verticalSplit = [{
        x: centerBetweenPoints.x,
        y: sourceGap.y
      }, {
        x: centerBetweenPoints.x,
        y: targetGap.y
      }];
      const horizontalSplit = [{
        x: sourceGap.x,
        y: centerBetweenPoints.y
      }, {
        x: targetGap.x,
        y: centerBetweenPoints.y
      }];
      if (sourceDirection[directionAccessor] === currentDirection) {
        points = directionAccessor === "x" ? verticalSplit : horizontalSplit;
      } else {
        points = directionAccessor === "x" ? horizontalSplit : verticalSplit;
      }
    } else {
      points = buildCornerMidPointsAndApplyOffsets({
        axis: directionAccessor,
        source,
        target,
        sourceSide,
        targetSide,
        sourceGap,
        targetGap,
        sourceDir: sourceDirection,
        targetDir: targetDirection,
        currentDir: currentDirection,
        offset,
        sourceGapOffset,
        targetGapOffset
      });
    }
    return [source, {
      x: sourceGap.x + sourceGapOffset.x,
      y: sourceGap.y + sourceGapOffset.y
    }, ...points, {
      x: targetGap.x + targetGapOffset.x,
      y: targetGap.y + targetGapOffset.y
    }, target];
  }
  _getDirection(source, sourceSide, target) {
    if (sourceSide === EFConnectableSide.LEFT || sourceSide === EFConnectableSide.RIGHT) {
      return source.x < target.x ? PointExtensions.initialize(1, 0) : PointExtensions.initialize(-1, 0);
    }
    return source.y < target.y ? PointExtensions.initialize(0, 1) : PointExtensions.initialize(0, -1);
  }
};
var EPS = 2e-4;
var CalculateStraightLineData = class {
  handle(request) {
    const anchors = buildConnectionAnchors(request.source, request.target, request.waypoints);
    const n = anchors.length;
    const p0 = anchors[0];
    let d = `M ${p0.x} ${p0.y}`;
    const candidates = new Array(n - 1);
    for (let i = 0; i < n - 1; i++) {
      const a = anchors[i];
      const b = anchors[i + 1];
      const isLast = i === n - 2;
      const bx = isLast ? b.x + EPS : b.x;
      const by = isLast ? b.y + EPS : b.y;
      d += ` L ${bx} ${by}`;
      candidates[i] = {
        x: (a.x + b.x) * 0.5,
        y: (a.y + b.y) * 0.5
      };
    }
    return {
      path: d,
      candidates,
      points: anchors,
      secondPoint: anchors[1] ?? request.target,
      penultimatePoint: anchors[n - 2] ?? request.source
    };
  }
};
var F_CONNECTION_BUILDERS = new InjectionToken("F_CONNECTION_BUILDERS");
var ConnectionLineBuilder = class _ConnectionLineBuilder {
  _builtinBuilders = {
    [EFConnectionType.STRAIGHT]: new CalculateStraightLineData(),
    [EFConnectionType.BEZIER]: new CalculateBezierCurveData(),
    [EFConnectionType.ADAPTIVE_CURVE]: new CalculateAdaptiveCurveData(),
    [EFConnectionType.SEGMENT]: new CalculateSegmentLineData()
  };
  _providedBuilders;
  _builders;
  constructor() {
    this._providedBuilders = inject(F_CONNECTION_BUILDERS, {
      optional: true
    }) || {};
    this._builders = __spreadValues(__spreadValues({}, this._builtinBuilders), this._providedBuilders);
  }
  handle({
    type,
    payload
  }) {
    const builder = this._builders[type];
    if (!builder) {
      throw this._createBuilderNotFoundError(type);
    }
    return builder.handle(payload);
  }
  _createBuilderNotFoundError(requestedType) {
    const builtinTypes = Object.keys(this._builtinBuilders).sort();
    const providedTypes = Object.keys(this._providedBuilders).sort();
    const registeredTypes = Object.keys(this._builders).sort();
    const overriddenBuiltins = builtinTypes.filter((t) => t in this._providedBuilders).sort();
    const lines = [`Connection Builder Error: builder type "${requestedType}" not found.`, `Registered types: ${registeredTypes.length ? registeredTypes.join(", ") : "(none)"}`, `Built-in types: ${builtinTypes.length ? builtinTypes.join(", ") : "(none)"}`, `Provided (F_CONNECTION_BUILDERS) types: ${providedTypes.length ? providedTypes.join(", ") : "(none)"}`, overriddenBuiltins.length ? `Overridden built-ins: ${overriddenBuiltins.join(", ")}` : null, `Tip: ensure you pass a valid Connection Type or provide a builder via F_CONNECTION_BUILDERS.`].filter(Boolean);
    return new Error(lines.join("\n"));
  }
  static ɵfac = function ConnectionLineBuilder_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ConnectionLineBuilder)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ConnectionLineBuilder,
    factory: _ConnectionLineBuilder.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ConnectionLineBuilder, [{
    type: Injectable
  }], () => [], null);
})();
var ConnectionLineBuilderRequest = class {
  type;
  payload;
  constructor(type, payload) {
    this.type = type;
    this.payload = payload;
  }
};
function createConnectionDomIdentifier(componentId, sourceId, targetId) {
  return normalizeDomElementId("connection_" + componentId + sourceId + targetId);
}
function createConnectionSelectionDomIdentifier(componentId, sourceId, targetId) {
  return normalizeDomElementId("connection_for_selection_" + componentId + sourceId + targetId);
}
function createGradientDomIdentifier(componentId) {
  return normalizeDomElementId("connection_gradient_" + componentId);
}
function createGradientDomUrl(componentId) {
  return `url(#${createGradientDomIdentifier(componentId)})`;
}
var FConnectionGradientRendererBase = class _FConnectionGradientRendererBase {
  _connection = inject(F_CONNECTION_COMPONENTS_PARENT);
  _hostElement = inject(ElementRef).nativeElement;
  _injector = inject(Injector);
  _hostAttributes = /* @__PURE__ */ new Map();
  _startColor;
  _endColor;
  gradientId = computed(() => createGradientDomIdentifier(this._connection.fId()), ...ngDevMode ? [{
    debugName: "gradientId"
  }] : []);
  ngOnInit() {
    this._listenColorChanges();
  }
  _listenColorChanges() {
    effect(() => {
      this.gradient().fStartColor();
      this.gradient().fEndColor();
      untracked(() => {
        this._updateGradient();
      });
    }, {
      injector: this._injector
    });
  }
  get stop1Element() {
    return this._hostElement.children.item(0);
  }
  get stop2Element() {
    return this._hostElement.children.item(1);
  }
  redraw(line) {
    const x = line.point2.x - line.point1.x;
    const y = line.point2.y - line.point1.y;
    const distance = Math.sqrt(x * x + y * y) || 0.01;
    const from = new Point(0.5 - 0.5 * x / distance, 0.5 - 0.5 * y / distance);
    this._setHostAttribute("x1", from.x.toString());
    this._setHostAttribute("y1", from.y.toString());
    const to = new Point(0.5 + 0.5 * x / distance, 0.5 + 0.5 * y / distance);
    this._setHostAttribute("x2", to.x.toString());
    this._setHostAttribute("y2", to.y.toString());
    this._updateGradient();
  }
  _updateGradient() {
    const gradient = this.gradient();
    this._setFromColor(gradient.fStartColor());
    this._setToColor(gradient.fEndColor());
  }
  _setFromColor(color) {
    const nextColor = color || "transparent";
    if (this._startColor === nextColor) {
      return;
    }
    this._startColor = nextColor;
    this.stop1Element.setAttribute("stop-color", nextColor);
    this.stop1Element.style.setProperty("stop-color", nextColor);
  }
  _setToColor(color) {
    const nextColor = color || "transparent";
    if (this._endColor === nextColor) {
      return;
    }
    this._endColor = nextColor;
    this.stop2Element.setAttribute("stop-color", nextColor);
    this.stop2Element.style.setProperty("stop-color", nextColor);
  }
  _setHostAttribute(name, value) {
    if (this._hostAttributes.get(name) === value) {
      return;
    }
    this._hostAttributes.set(name, value);
    this._hostElement.setAttribute(name, value);
  }
  static ɵfac = function FConnectionGradientRendererBase_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FConnectionGradientRendererBase)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FConnectionGradientRendererBase
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FConnectionGradientRendererBase, [{
    type: Directive,
    args: [{}]
  }], null, null);
})();
var FConnectionGradientRenderer = class _FConnectionGradientRenderer extends FConnectionGradientRendererBase {
  gradient = input.required(...ngDevMode ? [{
    debugName: "gradient",
    alias: "fConnectionGradientRendererFor"
  }] : [{
    alias: "fConnectionGradientRendererFor"
  }]);
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFConnectionGradientRenderer_BaseFactory;
    return function FConnectionGradientRenderer_Factory(__ngFactoryType__) {
      return (ɵFConnectionGradientRenderer_BaseFactory || (ɵFConnectionGradientRenderer_BaseFactory = ɵɵgetInheritedFactory(_FConnectionGradientRenderer)))(__ngFactoryType__ || _FConnectionGradientRenderer);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _FConnectionGradientRenderer,
    selectors: [["linearGradient", "fConnectionGradientRenderer", ""]],
    hostVars: 1,
    hostBindings: function FConnectionGradientRenderer_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("id", ctx.gradientId());
      }
    },
    inputs: {
      gradient: [1, "fConnectionGradientRendererFor", "gradient"]
    },
    features: [ɵɵInheritDefinitionFeature],
    attrs: _c1,
    decls: 3,
    vars: 0,
    consts: [[0, "xmlns", "svg", "http://www.w3.org/2000/svg"], ["offset", "0%"], ["offset", "100%"]],
    template: function FConnectionGradientRenderer_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵelementContainerStart(0, 0);
        ɵɵnamespaceSVG();
        ɵɵelement(1, "stop", 1)(2, "stop", 2);
        ɵɵelementContainerEnd();
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FConnectionGradientRenderer, [{
    type: Component,
    args: [{
      selector: "linearGradient[fConnectionGradientRenderer]",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "[attr.id]": "gradientId()"
      },
      template: '<ng-container xmlns:svg="http://www.w3.org/2000/svg">\n  <svg:stop offset="0%" />\n  <svg:stop offset="100%" />\n</ng-container>\n'
    }]
  }], null, {
    gradient: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fConnectionGradientRendererFor",
        required: true
      }]
    }]
  });
})();
var F_CONNECTION_GRADIENT = new InjectionToken("F_CONNECTION_GRADIENT");
var FConnectionGradientBase = class {
};
var FConnectionGradient = class _FConnectionGradient extends FConnectionGradientBase {
  fStartColor = input.required(...ngDevMode ? [{
    debugName: "fStartColor"
  }] : []);
  fEndColor = input.required(...ngDevMode ? [{
    debugName: "fEndColor"
  }] : []);
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFConnectionGradient_BaseFactory;
    return function FConnectionGradient_Factory(__ngFactoryType__) {
      return (ɵFConnectionGradient_BaseFactory || (ɵFConnectionGradient_BaseFactory = ɵɵgetInheritedFactory(_FConnectionGradient)))(__ngFactoryType__ || _FConnectionGradient);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _FConnectionGradient,
    selectors: [["f-connection-gradient"]],
    hostAttrs: [2, "display", "none"],
    inputs: {
      fStartColor: [1, "fStartColor"],
      fEndColor: [1, "fEndColor"]
    },
    features: [ɵɵProvidersFeature([{
      provide: F_CONNECTION_GRADIENT,
      useExisting: _FConnectionGradient
    }]), ɵɵInheritDefinitionFeature],
    decls: 0,
    vars: 0,
    template: function FConnectionGradient_Template(rf, ctx) {
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FConnectionGradient, [{
    type: Component,
    args: [{
      selector: "f-connection-gradient",
      template: "",
      standalone: true,
      host: {
        style: "display: none;"
      },
      providers: [{
        provide: F_CONNECTION_GRADIENT,
        useExisting: FConnectionGradient
      }]
    }]
  }], null, {
    fStartColor: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fStartColor",
        required: true
      }]
    }],
    fEndColor: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fEndColor",
        required: true
      }]
    }]
  });
})();
var F_CONNECTION_PATH = new InjectionToken("F_CONNECTION_PATH");
var FConnectionPathBase = class {
  hostElement = inject(ElementRef).nativeElement;
};
var FConnectionPath = class _FConnectionPath extends FConnectionPathBase {
  _connection = inject(F_CONNECTION_COMPONENTS_PARENT);
  useGradient = input(false, ...ngDevMode ? [{
    debugName: "useGradient"
  }] : []);
  linkToGradient = computed(() => {
    if (!this.useGradient()) {
      return null;
    }
    return createGradientDomUrl(this._connection.fId());
  }, ...ngDevMode ? [{
    debugName: "linkToGradient"
  }] : []);
  get fPathId() {
    return this._connection.fId();
  }
  get attrConnectionId() {
    return createConnectionDomIdentifier(this._connection.fId(), this._connection.fOutputId(), this._connection.fInputId());
  }
  initialize() {
    this.deselect();
  }
  setPath(path) {
    this.hostElement.setAttribute("d", `${path}`);
  }
  select() {
    this.hostElement.setAttribute("marker-start", `url(#${getMarkerSelectedStartId(this._connection.fId())})`);
    this.hostElement.setAttribute("marker-end", `url(#${getMarkerSelectedEndId(this._connection.fId())})`);
  }
  deselect() {
    this.hostElement.setAttribute("marker-start", `url(#${getMarkerStartId(this._connection.fId())})`);
    this.hostElement.setAttribute("marker-end", `url(#${getMarkerEndId(this._connection.fId())})`);
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFConnectionPath_BaseFactory;
    return function FConnectionPath_Factory(__ngFactoryType__) {
      return (ɵFConnectionPath_BaseFactory || (ɵFConnectionPath_BaseFactory = ɵɵgetInheritedFactory(_FConnectionPath)))(__ngFactoryType__ || _FConnectionPath);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _FConnectionPath,
    selectors: [["path", "f-connection-path", ""]],
    hostAttrs: [1, "f-component", "f-connection-path"],
    hostVars: 4,
    hostBindings: function FConnectionPath_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("id", ctx.attrConnectionId)("data-f-path-id", ctx.fPathId);
        ɵɵstyleProp("stroke", ctx.linkToGradient());
      }
    },
    inputs: {
      useGradient: [1, "useGradient"]
    },
    standalone: false,
    features: [ɵɵProvidersFeature([{
      provide: F_CONNECTION_PATH,
      useExisting: _FConnectionPath
    }]), ɵɵInheritDefinitionFeature],
    attrs: _c2,
    decls: 0,
    vars: 0,
    template: function FConnectionPath_Template(rf, ctx) {
    },
    styles: ["[_nghost-%COMP%]{fill:none;pointer-events:stroke}"],
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FConnectionPath, [{
    type: Component,
    args: [{
      standalone: false,
      selector: "path[f-connection-path]",
      template: "",
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        class: "f-component f-connection-path",
        "[attr.id]": "attrConnectionId",
        "[attr.data-f-path-id]": "fPathId",
        "[style.stroke]": "linkToGradient()"
      },
      providers: [{
        provide: F_CONNECTION_PATH,
        useExisting: FConnectionPath
      }],
      styles: [":host{fill:none;pointer-events:stroke}\n"]
    }]
  }], null, {
    useGradient: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "useGradient",
        required: false
      }]
    }]
  });
})();
function getMarkerStartId(fConnectionId) {
  return normalizeDomElementId(`f-connection-marker-start-${fConnectionId}`);
}
function getMarkerEndId(fConnectionId) {
  return normalizeDomElementId(`f-connection-marker-end-${fConnectionId}`);
}
function getMarkerSelectedStartId(fConnectionId) {
  return normalizeDomElementId(`f-connection-selected-marker-start-${fConnectionId}`);
}
function getMarkerSelectedEndId(fConnectionId) {
  return normalizeDomElementId(`f-connection-selected-marker-end-${fConnectionId}`);
}
var F_CONNECTION_SELECTION = new InjectionToken("F_CONNECTION_SELECTION");
var FConnectionSelectionBase = class {
  hostElement = inject(ElementRef).nativeElement;
};
var FConnectionSelection = class _FConnectionSelection extends FConnectionSelectionBase {
  _connection = inject(F_CONNECTION_COMPONENTS_PARENT);
  get connectionForSelectionId() {
    return createConnectionSelectionDomIdentifier(this._connection.fId(), this._connection.fOutputId(), this._connection.fInputId());
  }
  setPath(path) {
    this.hostElement.setAttribute("d", `${path}`);
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFConnectionSelection_BaseFactory;
    return function FConnectionSelection_Factory(__ngFactoryType__) {
      return (ɵFConnectionSelection_BaseFactory || (ɵFConnectionSelection_BaseFactory = ɵɵgetInheritedFactory(_FConnectionSelection)))(__ngFactoryType__ || _FConnectionSelection);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _FConnectionSelection,
    selectors: [["path", "fConnectionSelection", ""]],
    hostAttrs: [1, "f-component", "f-connection-selection"],
    hostVars: 1,
    hostBindings: function FConnectionSelection_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("id", ctx.connectionForSelectionId);
      }
    },
    standalone: false,
    features: [ɵɵProvidersFeature([{
      provide: F_CONNECTION_SELECTION,
      useExisting: _FConnectionSelection
    }]), ɵɵInheritDefinitionFeature],
    attrs: _c3,
    decls: 0,
    vars: 0,
    template: function FConnectionSelection_Template(rf, ctx) {
    },
    styles: ["[_nghost-%COMP%]{fill:none;pointer-events:stroke}"],
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FConnectionSelection, [{
    type: Component,
    args: [{
      standalone: false,
      selector: "path[fConnectionSelection]",
      template: "",
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        class: "f-component f-connection-selection",
        "[attr.id]": "connectionForSelectionId"
      },
      providers: [{
        provide: F_CONNECTION_SELECTION,
        useExisting: FConnectionSelection
      }],
      styles: [":host{fill:none;pointer-events:stroke}\n"]
    }]
  }], null, null);
})();
var F_CONNECTION_DRAG_HANDLE_END = new InjectionToken("F_CONNECTION_DRAG_HANDLE_END");
var F_CONNECTION_DRAG_HANDLE_START = new InjectionToken("F_CONNECTION_DRAG_HANDLE_START");
var FConnectionDragHandleBase = class {
  hostElement = inject(ElementRef).nativeElement;
  point = PointExtensions.initialize();
  class = "f-connection-drag-handle";
  calculateCircleCenter(start, end, radius) {
    const direction = {
      x: end.x - start.x,
      y: end.y - start.y
    };
    const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y) || 1;
    const unitDirection = {
      x: direction.x / length,
      y: direction.y / length
    };
    const scaledDirection = {
      x: unitDirection.x * radius,
      y: unitDirection.y * radius
    };
    return {
      x: end.x - scaledDirection.x,
      y: end.y - scaledDirection.y
    };
  }
};
var FConnectionDragHandleStart = class _FConnectionDragHandleStart extends FConnectionDragHandleBase {
  redraw(penultimatePoint, startPoint) {
    this.point = this.calculateCircleCenter(penultimatePoint, startPoint, 8);
    this.hostElement.setAttribute("cx", this.point.x.toString());
    this.hostElement.setAttribute("cy", this.point.y.toString());
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFConnectionDragHandleStart_BaseFactory;
    return function FConnectionDragHandleStart_Factory(__ngFactoryType__) {
      return (ɵFConnectionDragHandleStart_BaseFactory || (ɵFConnectionDragHandleStart_BaseFactory = ɵɵgetInheritedFactory(_FConnectionDragHandleStart)))(__ngFactoryType__ || _FConnectionDragHandleStart);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _FConnectionDragHandleStart,
    selectors: [["circle", "f-connection-drag-handle-start", ""]],
    hostVars: 2,
    hostBindings: function FConnectionDragHandleStart_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassMap(ctx.class);
      }
    },
    standalone: false,
    features: [ɵɵProvidersFeature([{
      provide: F_CONNECTION_DRAG_HANDLE_START,
      useExisting: _FConnectionDragHandleStart
    }]), ɵɵInheritDefinitionFeature],
    attrs: _c4,
    decls: 0,
    vars: 0,
    template: function FConnectionDragHandleStart_Template(rf, ctx) {
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FConnectionDragHandleStart, [{
    type: Component,
    args: [{
      standalone: false,
      selector: "circle[f-connection-drag-handle-start]",
      template: "",
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "[class]": "class"
      },
      providers: [{
        provide: F_CONNECTION_DRAG_HANDLE_START,
        useExisting: FConnectionDragHandleStart
      }]
    }]
  }], null, null);
})();
var FConnectionDragHandleEnd = class _FConnectionDragHandleEnd extends FConnectionDragHandleBase {
  redraw(penultimatePoint, endPoint) {
    this.point = this.calculateCircleCenter(penultimatePoint, endPoint, 8);
    this.hostElement.setAttribute("cx", this.point.x.toString());
    this.hostElement.setAttribute("cy", this.point.y.toString());
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFConnectionDragHandleEnd_BaseFactory;
    return function FConnectionDragHandleEnd_Factory(__ngFactoryType__) {
      return (ɵFConnectionDragHandleEnd_BaseFactory || (ɵFConnectionDragHandleEnd_BaseFactory = ɵɵgetInheritedFactory(_FConnectionDragHandleEnd)))(__ngFactoryType__ || _FConnectionDragHandleEnd);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _FConnectionDragHandleEnd,
    selectors: [["circle", "f-connection-drag-handle-end", ""]],
    hostVars: 2,
    hostBindings: function FConnectionDragHandleEnd_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassMap(ctx.class);
      }
    },
    standalone: false,
    features: [ɵɵProvidersFeature([{
      provide: F_CONNECTION_DRAG_HANDLE_END,
      useExisting: _FConnectionDragHandleEnd
    }]), ɵɵInheritDefinitionFeature],
    attrs: _c5,
    decls: 0,
    vars: 0,
    template: function FConnectionDragHandleEnd_Template(rf, ctx) {
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FConnectionDragHandleEnd, [{
    type: Component,
    args: [{
      standalone: false,
      selector: "circle[f-connection-drag-handle-end]",
      template: "",
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "[class]": "class"
      },
      providers: [{
        provide: F_CONNECTION_DRAG_HANDLE_END,
        useExisting: FConnectionDragHandleEnd
      }]
    }]
  }], null, null);
})();
var F_SELECTED_CLASS = "f-selected";
function mixinChangeSelection(base) {
  return class extends base {
    fId = signal("", ...ngDevMode ? [{
      debugName: "fId"
    }] : []);
    fSelectionDisabled = signal(false, ...ngDevMode ? [{
      debugName: "fSelectionDisabled"
    }] : []);
    unmarkAsSelected() {
      this.unmarkChildrenAsSelected?.();
      this.hostElement.classList.remove(F_SELECTED_CLASS);
    }
    markAsSelected() {
      this.markChildrenAsSelected?.();
      if (!this.isSelected()) {
        this.hostElement.classList.add(F_SELECTED_CLASS);
      }
    }
    isSelected() {
      return this.hostElement.classList.contains(F_SELECTED_CLASS);
    }
    markChildrenAsSelected() {
    }
    unmarkChildrenAsSelected() {
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args) {
      super(...args);
    }
  };
}
function mixinChangeVisibility(base) {
  return class extends base {
    show() {
      this.hostElement.style.display = "unset";
    }
    hide() {
      this.hostElement.style.display = "none";
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args) {
      super(...args);
    }
  };
}
var MIXIN_BASE$1 = mixinChangeSelection(mixinChangeVisibility(class {
  hostElement;
  constructor(hostElement) {
    this.hostElement = hostElement;
  }
}));
var FConnectionBase = class _FConnectionBase extends MIXIN_BASE$1 {
  _fConnectionBuilder = inject(ConnectionLineBuilder);
  path = "";
  line = LineExtensions.initialize();
  fReassignableStart = signal(false, ...ngDevMode ? [{
    debugName: "fReassignableStart"
  }] : []);
  fDraggingDisabled = signal(false, ...ngDevMode ? [{
    debugName: "fDraggingDisabled"
  }] : []);
  fSelectionDisabled = signal(false, ...ngDevMode ? [{
    debugName: "fSelectionDisabled"
  }] : []);
  fDefs = viewChild.required("defs");
  fPath = viewChild.required(F_CONNECTION_PATH);
  fDragHandleStart = viewChild(F_CONNECTION_DRAG_HANDLE_START, ...ngDevMode ? [{
    debugName: "fDragHandleStart"
  }] : []);
  fDragHandleEnd = viewChild.required(F_CONNECTION_DRAG_HANDLE_END);
  fSelection = viewChild.required(F_CONNECTION_SELECTION);
  fContents = contentChildren(F_CONNECTION_CONTENT, ...ngDevMode ? [{
    debugName: "fContents",
    descendants: true
  }] : [{
    descendants: true
  }]);
  fMarkers = contentChildren(F_CONNECTION_MARKER, ...ngDevMode ? [{
    debugName: "fMarkers",
    descendants: true
  }] : [{
    descendants: true
  }]);
  fGradient = contentChild(F_CONNECTION_GRADIENT, ...ngDevMode ? [{
    debugName: "fGradient"
  }] : []);
  _fGradientRenderer = viewChild(FConnectionGradientRenderer, ...ngDevMode ? [{
    debugName: "_fGradientRenderer"
  }] : []);
  fWaypoints = contentChild(F_CONNECTION_WAYPOINTS, ...ngDevMode ? [{
    debugName: "fWaypoints"
  }] : []);
  fInputSide = signal(EFConnectionConnectableSide.DEFAULT, ...ngDevMode ? [{
    debugName: "fInputSide"
  }] : []);
  _contentLayoutEngine = new ConnectionContentLayoutEngine();
  _sourceSide = EFConnectableSide.AUTO;
  fOutputSide = signal(EFConnectionConnectableSide.DEFAULT, ...ngDevMode ? [{
    debugName: "fOutputSide"
  }] : []);
  _targetSide = EFConnectableSide.AUTO;
  _penultimatePoint = PointExtensions.initialize();
  _secondPoint = PointExtensions.initialize();
  constructor() {
    super(inject(ElementRef).nativeElement);
  }
  initialize() {
    this.redraw();
    this.isSelected() ? this.markChildrenAsSelected() : this.unmarkChildrenAsSelected();
  }
  isContains(element) {
    return (this.hostElement.firstChild?.lastChild).contains(element) || Array.from(this.fContents()?.values() ?? []).some((x) => x.hostElement?.contains(element)) || this.fWaypoints()?.hostElement?.contains(element);
  }
  setLine({
    point1,
    point2
  }) {
    this.line = LineExtensions.initialize(point1, point2);
    const {
      path,
      points,
      penultimatePoint,
      secondPoint,
      candidates
    } = this._getPathResult(point1, point2);
    this.path = path;
    this._penultimatePoint = penultimatePoint || point1;
    this._secondPoint = secondPoint || point2;
    this.fWaypoints()?.candidates.set(candidates || []);
    this._contentLayoutEngine.layout(points || [], this._contents());
  }
  _contents() {
    return Array.from(this.fContents()?.values() ?? []);
  }
  _getPathResult(source, target) {
    return this._fConnectionBuilder.handle({
      type: this.fType,
      payload: {
        source,
        sourceSide: this._sourceSide,
        target,
        targetSide: this._targetSide,
        radius: this.fRadius,
        offset: this.fOffset,
        waypoints: this.fWaypoints()?.waypoints() || []
      }
    });
  }
  markChildrenAsSelected() {
    this.fPath().select();
  }
  unmarkChildrenAsSelected() {
    this.fPath().deselect();
  }
  redraw() {
    this.fPath().setPath(this.path);
    this.fSelection().setPath(this.path);
    this.fDragHandleEnd().redraw(this._penultimatePoint, this.line.point2);
    this.fDragHandleStart()?.redraw(this._secondPoint, this.line.point1);
    this._fGradientRenderer()?.redraw(this.line);
  }
  getResolvedSides() {
    return {
      sourceSide: this._sourceSide,
      targetSide: this._targetSide
    };
  }
  /**
   * Applies the resolved sides to the connection. Don't call this method directly; it's used internally.
   *
   * @param sourceSide The resolved side for the source element.
   * @param targetSide The resolved side for the target element.
   */
  _applyResolvedSidesToConnection(sourceSide, targetSide) {
    this._sourceSide = sourceSide;
    this._targetSide = targetSide;
  }
  static ɵfac = function FConnectionBase_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FConnectionBase)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FConnectionBase,
    contentQueries: function FConnectionBase_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuerySignal(dirIndex, ctx.fContents, F_CONNECTION_CONTENT, 5);
        ɵɵcontentQuerySignal(dirIndex, ctx.fMarkers, F_CONNECTION_MARKER, 5);
        ɵɵcontentQuerySignal(dirIndex, ctx.fGradient, F_CONNECTION_GRADIENT, 5);
        ɵɵcontentQuerySignal(dirIndex, ctx.fWaypoints, F_CONNECTION_WAYPOINTS, 5);
      }
      if (rf & 2) {
        ɵɵqueryAdvance(4);
      }
    },
    viewQuery: function FConnectionBase_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuerySignal(ctx.fDefs, _c6, 5);
        ɵɵviewQuerySignal(ctx.fPath, F_CONNECTION_PATH, 5);
        ɵɵviewQuerySignal(ctx.fDragHandleStart, F_CONNECTION_DRAG_HANDLE_START, 5);
        ɵɵviewQuerySignal(ctx.fDragHandleEnd, F_CONNECTION_DRAG_HANDLE_END, 5);
        ɵɵviewQuerySignal(ctx.fSelection, F_CONNECTION_SELECTION, 5);
        ɵɵviewQuerySignal(ctx._fGradientRenderer, FConnectionGradientRenderer, 5);
      }
      if (rf & 2) {
        ɵɵqueryAdvance(6);
      }
    },
    features: [ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FConnectionBase, [{
    type: Directive
  }], () => [], {
    fDefs: [{
      type: ViewChild,
      args: ["defs", {
        isSignal: true
      }]
    }],
    fPath: [{
      type: ViewChild,
      args: [forwardRef(() => F_CONNECTION_PATH), {
        isSignal: true
      }]
    }],
    fDragHandleStart: [{
      type: ViewChild,
      args: [forwardRef(() => F_CONNECTION_DRAG_HANDLE_START), {
        isSignal: true
      }]
    }],
    fDragHandleEnd: [{
      type: ViewChild,
      args: [forwardRef(() => F_CONNECTION_DRAG_HANDLE_END), {
        isSignal: true
      }]
    }],
    fSelection: [{
      type: ViewChild,
      args: [forwardRef(() => F_CONNECTION_SELECTION), {
        isSignal: true
      }]
    }],
    fContents: [{
      type: ContentChildren,
      args: [forwardRef(() => F_CONNECTION_CONTENT), __spreadProps(__spreadValues({}, {
        descendants: true
      }), {
        isSignal: true
      })]
    }],
    fMarkers: [{
      type: ContentChildren,
      args: [forwardRef(() => F_CONNECTION_MARKER), __spreadProps(__spreadValues({}, {
        descendants: true
      }), {
        isSignal: true
      })]
    }],
    fGradient: [{
      type: ContentChild,
      args: [forwardRef(() => F_CONNECTION_GRADIENT), {
        isSignal: true
      }]
    }],
    _fGradientRenderer: [{
      type: ViewChild,
      args: [forwardRef(() => FConnectionGradientRenderer), {
        isSignal: true
      }]
    }],
    fWaypoints: [{
      type: ContentChild,
      args: [forwardRef(() => F_CONNECTION_WAYPOINTS), {
        isSignal: true
      }]
    }]
  });
})();
var CreateConnectionMarkers = class CreateConnectionMarkers2 {
  _browser = inject(BrowserService);
  _markerCache = /* @__PURE__ */ new WeakMap();
  handle({
    connection
  }) {
    const markers = this._findConnectionMarkers(connection);
    const defs = connection.fDefs();
    if (!defs) {
      return false;
    }
    const signature = createConnectionMarkersSignature(markers);
    const cached = this._markerCache.get(connection);
    if (cached?.signature === signature && cached.defsElement === defs.nativeElement) {
      return false;
    }
    const element = createSVGElement$1("defs", this._browser);
    markers.forEach((marker) => {
      resolveMarkerTypes(marker.type).forEach((type) => {
        const markerElement = createMarkerElement(type, marker, connection.fId(), this._browser);
        const clone = marker.markerElement.cloneNode(true);
        clone.setAttribute("height", `${marker.height}`);
        clone.setAttribute("width", `${marker.width}`);
        clone.removeAttribute("markerUnits");
        clone.style.display = "unset";
        markerElement.append(clone);
        element.append(markerElement);
      });
    });
    defs.nativeElement.innerHTML = element.innerHTML;
    this._markerCache.set(connection, {
      signature,
      defsElement: defs.nativeElement
    });
    this._makeSafariCompatible(connection);
    return true;
  }
  _findConnectionMarkers(connection) {
    return Array.from(connection.fMarkers() ?? []);
  }
  // Safari does not support markers on path elements if markers are defined after the path element
  _makeSafariCompatible(fConnection) {
    fConnection.fPath().hostElement.replaceWith(fConnection.fPath().hostElement);
  }
  static ɵfac = function CreateConnectionMarkers_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CreateConnectionMarkers2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CreateConnectionMarkers2,
    factory: CreateConnectionMarkers2.ɵfac
  });
};
CreateConnectionMarkers = __decorate([FExecutionRegister(CreateConnectionMarkersRequest)], CreateConnectionMarkers);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CreateConnectionMarkers, [{
    type: Injectable
  }], null, null);
})();
function createConnectionMarkersSignature(markers) {
  return markers.map((marker) => [...resolveMarkerTypes(marker.type), marker.width, marker.height, marker.refX, marker.refY, marker.orient, marker.markerUnits, marker.markerElement.outerHTML].join("|")).join("||");
}
function createMarkerElement(type, marker, connectionId, browser) {
  const markerElement = createSVGElement$1("marker", browser);
  markerElement.setAttribute("id", normalizeDomElementId(type + "-" + connectionId));
  markerElement.setAttribute("markerHeight", `${marker.height}`);
  markerElement.setAttribute("markerWidth", `${marker.width}`);
  markerElement.setAttribute("orient", `${marker.orient}`);
  markerElement.setAttribute("refX", `${marker.refX}`);
  markerElement.setAttribute("refY", `${marker.refY}`);
  markerElement.setAttribute("markerUnits", `${marker.markerUnits}`);
  return markerElement;
}
function resolveMarkerTypes(type) {
  switch (type) {
    case EFMarkerType.START:
      return [EFMarkerType.START];
    case EFMarkerType.END:
      return [EFMarkerType.END];
    case EFMarkerType.SELECTED_START:
      return [EFMarkerType.SELECTED_START];
    case EFMarkerType.SELECTED_END:
      return [EFMarkerType.SELECTED_END];
    case EFMarkerType.START_ALL_STATES:
      return [EFMarkerType.START, EFMarkerType.SELECTED_START];
    case EFMarkerType.END_ALL_STATES:
      return [EFMarkerType.END, EFMarkerType.SELECTED_END];
    default:
      return [];
  }
}
function createSVGElement$1(tag, fBrowser) {
  return fBrowser.document.createElementNS("http://www.w3.org/2000/svg", tag);
}
var ConnectionRedrawState = class _ConnectionRedrawState {
  renderTicket = 0;
  _connectedInPreviousRender = /* @__PURE__ */ new Set();
  beginRender() {
    return ++this.renderTicket;
  }
  resetConnectedConnectors() {
    for (const connector of this._connectedInPreviousRender) {
      connector.resetConnected();
    }
    this._connectedInPreviousRender.clear();
  }
  trackConnectedConnectors(source, target) {
    this._connectedInPreviousRender.add(source);
    this._connectedInPreviousRender.add(target);
  }
  static ɵfac = function ConnectionRedrawState_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ConnectionRedrawState)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ConnectionRedrawState,
    factory: _ConnectionRedrawState.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ConnectionRedrawState, [{
    type: Injectable
  }], null, null);
})();
var F_CONNECTION_WORKER_SOURCE = String.raw`
const EPSILON = 0.5;

addEventListener('message', (event) => {
  const data = event?.data;
  const requestId = data?.requestId;
  const items = Array.isArray(data?.items) ? data.items : [];

  try {
    const results = items.map((item) => calculateItem(item));
    postMessage({ requestId, results });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Connection worker failed.';
    postMessage({ requestId, error: message });
  }
});

function calculateItem(item) {
  const sourceCenterX = item.sourceRect.x + item.sourceRect.width / 2;
  const sourceCenterY = item.sourceRect.y + item.sourceRect.height / 2;
  const targetCenterX = item.targetRect.x + item.targetRect.width / 2;
  const targetCenterY = item.targetRect.y + item.targetRect.height / 2;

  const sourceSide = resolveConnectableSide(
    item.outputSide,
    targetCenterX - sourceCenterX,
    targetCenterY - sourceCenterY,
    item.sourceConnectableSide,
  );

  const targetSide = resolveConnectableSide(
    item.inputSide,
    sourceCenterX - targetCenterX,
    sourceCenterY - targetCenterY,
    item.targetConnectableSide,
  );

  if (item.behavior === 'fixed_center') {
    return {
      originalIndex: item.originalIndex,
      supported: true,
      sourceSide,
      targetSide,
      line: {
        point1: { x: sourceCenterX, y: sourceCenterY },
        point2: { x: targetCenterX, y: targetCenterY },
      },
    };
  }

  if (item.sourceRotation || item.targetRotation) {
    return { originalIndex: item.originalIndex, supported: false };
  }

  if (item.behavior !== 'fixed') {
    if (item.behavior !== 'floating') {
      return { originalIndex: item.originalIndex, supported: false };
    }

    if (hasRoundedCorners(item.sourceRect) || hasRoundedCorners(item.targetRect)) {
      return { originalIndex: item.originalIndex, supported: false };
    }

    return {
      originalIndex: item.originalIndex,
      supported: true,
      sourceSide,
      targetSide,
      line: buildFloatingLine(item.sourceRect, item.targetRect),
    };
  }

  const line = buildFixedLine(item.sourceRect, item.targetRect, sourceSide, targetSide);
  if (!line) {
    return { originalIndex: item.originalIndex, supported: false };
  }

  return {
    originalIndex: item.originalIndex,
    supported: true,
    sourceSide,
    targetSide,
    line,
  };
}

function resolveConnectableSide(requestedSide, deltaX, deltaY, fallbackSide) {
  if (requestedSide === 'default') {
    return fallbackSide;
  }

  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);
  const nearZero = absX < EPSILON && absY < EPSILON;

  if (nearZero) {
    return fallbackSide;
  }

  const horizontalDominant = absX >= absY;

  switch (requestedSide) {
    case 'calculate':
      return horizontalDominant ? (deltaX >= 0 ? 'right' : 'left') : deltaY >= 0 ? 'bottom' : 'top';

    case 'calculate_horizontal':
      if (absX < EPSILON) {
        return fallbackSide;
      }

      return deltaX >= 0 ? 'right' : 'left';

    case 'calculate_vertical':
      if (absY < EPSILON) {
        return fallbackSide;
      }

      return deltaY >= 0 ? 'bottom' : 'top';

    case 'top':
    case 'bottom':
    case 'left':
    case 'right':
      return requestedSide;

    default:
      return fallbackSide;
  }
}

function buildFixedLine(sourceRect, targetRect, sourceSide, targetSide) {
  const sourceAnchor = sourceSide === 'auto' ? 'bottom' : sourceSide;
  const targetAnchor = targetSide === 'auto' ? 'top' : targetSide;

  const point1 = getSidePoint(sourceRect, sourceAnchor);
  const point2 = getSidePoint(targetRect, targetAnchor);

  if (!point1 || !point2) {
    return null;
  }

  return { point1, point2 };
}

function buildFloatingLine(sourceRect, targetRect) {
  const sourceCenter = getRectCenter(sourceRect);
  const targetCenter = getRectCenter(targetRect);

  return {
    point1: getRectBorderIntersection(sourceRect, sourceCenter, targetCenter),
    point2: getRectBorderIntersection(targetRect, targetCenter, sourceCenter),
  };
}

function hasRoundedCorners(rect) {
  return !!(rect.radius1 || rect.radius2 || rect.radius3 || rect.radius4);
}

function getRectCenter(rect) {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

function getRectBorderIntersection(rect, from, to) {
  const halfWidth = rect.width / 2;
  const halfHeight = rect.height / 2;
  const center = getRectCenter(rect);

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (Math.abs(dx) < EPSILON && Math.abs(dy) < EPSILON) {
    return center;
  }

  const scaleX = Math.abs(dx) < EPSILON ? Number.POSITIVE_INFINITY : halfWidth / Math.abs(dx);
  const scaleY = Math.abs(dy) < EPSILON ? Number.POSITIVE_INFINITY : halfHeight / Math.abs(dy);
  const scale = Math.min(scaleX, scaleY);

  return {
    x: center.x + dx * scale,
    y: center.y + dy * scale,
  };
}

function getSidePoint(rect, side) {
  const centerX = rect.x + rect.width / 2;
  const centerY = rect.y + rect.height / 2;

  switch (side) {
    case 'top':
      return { x: centerX, y: rect.y };

    case 'right':
      return { x: rect.x + rect.width, y: centerY };

    case 'bottom':
      return { x: centerX, y: rect.y + rect.height };

    case 'left':
      return { x: rect.x, y: centerY };

    default:
      return null;
  }
}
`.trim();
function isConnectionWorkerRuntimeSupported(windowRef) {
  return !!resolveConnectionWorkerRuntime(windowRef);
}
function resolveConnectionWorkerRuntime(windowRef) {
  const runtimeWindow = windowRef;
  const blobCtor = runtimeWindow?.Blob;
  const workerCtor = runtimeWindow?.Worker;
  const urlApi = runtimeWindow?.URL;
  if (!blobCtor || !workerCtor) {
    return null;
  }
  if (typeof urlApi?.createObjectURL !== "function" || typeof urlApi.revokeObjectURL !== "function") {
    return null;
  }
  return {
    blobCtor,
    workerCtor,
    urlApi
  };
}
function createConnectionWorkerUrl(runtime) {
  const blob = new runtime.blobCtor([F_CONNECTION_WORKER_SOURCE], {
    type: "text/javascript"
  });
  return runtime.urlApi.createObjectURL(blob);
}
function revokeConnectionWorkerUrl(workerUrl, urlApi) {
  if (!workerUrl) {
    return;
  }
  const resolvedUrlApi = urlApi ?? (typeof URL === "undefined" ? null : URL);
  if (typeof resolvedUrlApi?.revokeObjectURL !== "function") {
    return;
  }
  resolvedUrlApi.revokeObjectURL(workerUrl);
}
var ConnectionWorkerState = class _ConnectionWorkerState {
  worker = null;
  workerUrl = null;
  nextRequestId = 0;
  isDisabled = false;
  pending = /* @__PURE__ */ new Map();
  resetRuntime(error) {
    this.pending.forEach((request) => request.reject(error));
    this.pending.clear();
    this.worker?.terminate();
    this.worker = null;
    revokeConnectionWorkerUrl(this.workerUrl);
    this.workerUrl = null;
  }
  dispose() {
    this.resetRuntime(new Error("Connection worker was destroyed."));
  }
  static ɵfac = function ConnectionWorkerState_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ConnectionWorkerState)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ConnectionWorkerState,
    factory: _ConnectionWorkerState.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ConnectionWorkerState, [{
    type: Injectable
  }], null, null);
})();
var ApplyConnectionRenderRequest = class {
  connection;
  line;
  static fToken = Symbol("ApplyConnectionRenderRequest");
  constructor(connection, line) {
    this.connection = connection;
    this.line = line;
  }
};
var ApplyConnectionRender = class ApplyConnectionRender2 {
  _mediator = inject(FMediator);
  _renderCache = /* @__PURE__ */ new WeakMap();
  handle({
    connection,
    line
  }) {
    const markersChanged = this._mediator.execute(new CreateConnectionMarkersRequest(connection));
    if (!markersChanged && !this._shouldRender(connection, line)) {
      return;
    }
    connection.setLine(line);
    connection.initialize();
  }
  _shouldRender(connection, line) {
    const pathElement = connection.fPath().hostElement;
    const signature = this._createConnectionRenderSignature(connection, line);
    const cached = this._renderCache.get(connection);
    if (cached?.signature === signature && cached.pathElement === pathElement) {
      return false;
    }
    this._renderCache.set(connection, {
      signature,
      pathElement
    });
    return true;
  }
  _createConnectionRenderSignature(connection, line) {
    const {
      sourceSide,
      targetSide
    } = connection.getResolvedSides();
    return [connection.fBehavior, connection.fType, connection.fRadius, connection.fOffset, connection.fReassignableStart(), this._serializeContents([...connection.fContents() || []]), sourceSide, targetSide, this._serializePoint(line.point1), this._serializePoint(line.point2), this._serializeWaypoints(connection.fWaypoints()?.waypoints() || [])].join("|");
  }
  _serializePoint(point) {
    return `${point.x}:${point.y}`;
  }
  _serializeWaypoints(waypoints) {
    return waypoints.map(this._serializePoint).join(";");
  }
  _serializeContents(contents) {
    return contents.map((content) => {
      return [content.position(), content.offset(), content.align()].join(":");
    }).join(";");
  }
  static ɵfac = function ApplyConnectionRender_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ApplyConnectionRender2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ApplyConnectionRender2,
    factory: ApplyConnectionRender2.ɵfac
  });
};
ApplyConnectionRender = __decorate([FExecutionRegister(ApplyConnectionRenderRequest)], ApplyConnectionRender);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ApplyConnectionRender, [{
    type: Injectable
  }], null, null);
})();
var MarkConnectionConnectorsAsConnectedRequest = class {
  source;
  target;
  static fToken = Symbol("MarkConnectionConnectorsAsConnectedRequest");
  constructor(source, target) {
    this.source = source;
    this.target = target;
  }
};
var MarkConnectionConnectorsAsConnected = class MarkConnectionConnectorsAsConnected2 {
  _state = inject(ConnectionRedrawState);
  handle({
    source,
    target
  }) {
    source.setConnected(target);
    target.setConnected(source);
    this._state.trackConnectedConnectors(source, target);
  }
  static ɵfac = function MarkConnectionConnectorsAsConnected_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || MarkConnectionConnectorsAsConnected2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: MarkConnectionConnectorsAsConnected2,
    factory: MarkConnectionConnectorsAsConnected2.ɵfac
  });
};
MarkConnectionConnectorsAsConnected = __decorate([FExecutionRegister(MarkConnectionConnectorsAsConnectedRequest)], MarkConnectionConnectorsAsConnected);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MarkConnectionConnectorsAsConnected, [{
    type: Injectable
  }], null, null);
})();
var GetNormalizedConnectorRectRequest = class {
  element;
  cache;
  static fToken = Symbol("GetNormalizedConnectorRectRequest");
  constructor(element, cache = true) {
    this.element = element;
    this.cache = cache;
  }
};
var DEFAULT_CACHE_OPTIONS = {
  enabled: false
};
var F_CACHE_OPTIONS = new InjectionToken("F_CACHE_OPTIONS", {
  providedIn: "root",
  factory: () => __spreadValues({}, DEFAULT_CACHE_OPTIONS)
});
function fProvideCache(options = {}) {
  return {
    provide: F_CACHE_OPTIONS,
    useValue: __spreadValues(__spreadValues({}, DEFAULT_CACHE_OPTIONS), options)
  };
}
var RegisterFCacheConnectorRequest = class {
  id;
  nodeId;
  kind;
  element;
  static fToken = Symbol("RegisterFCacheConnectorRequest");
  constructor(id, nodeId, kind, element) {
    this.id = id;
    this.nodeId = nodeId;
    this.kind = kind;
    this.element = element;
  }
};
var FCache = class _FCache {
  nodeEntries = /* @__PURE__ */ new Map();
  nodeIdByElement = /* @__PURE__ */ new WeakMap();
  connectorEntries = /* @__PURE__ */ new Map();
  connectorKeysByNodeId = /* @__PURE__ */ new Map();
  connectorKeyByElement = /* @__PURE__ */ new WeakMap();
  static ɵfac = function FCache_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FCache)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _FCache,
    factory: _FCache.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FCache, [{
    type: Injectable
  }], null, null);
})();
var FCacheConnector = class {
  key;
  id;
  kind;
  nodeId;
  element;
  rect;
  constructor(key, id, kind, nodeId, element, rect) {
    this.key = key;
    this.id = id;
    this.kind = kind;
    this.nodeId = nodeId;
    this.element = element;
    this.rect = rect;
  }
};
var FCacheConnectorKeyFactory = class {
  static build(connectorId, kind) {
    return `${connectorId}:${kind}`;
  }
};
var FCacheNode = class {
  id;
  element;
  reference;
  rect;
  constructor(id, element, reference, rect) {
    this.id = id;
    this.element = element;
    this.reference = reference;
    this.rect = rect;
  }
};
var InvalidateFCacheNodeRequest = class {
  nodeId;
  reason;
  static fToken = Symbol("InvalidateFCacheNodeRequest");
  constructor(nodeId, reason = "manual") {
    this.nodeId = nodeId;
    this.reason = reason;
  }
};
var InvalidateFCacheNode = class InvalidateFCacheNode2 {
  _store = inject(FCache);
  _options = inject(F_CACHE_OPTIONS);
  handle({
    nodeId,
    reason: _reason
  }) {
    if (!this._options.enabled) {
      return;
    }
    const node = this._store.nodeEntries.get(nodeId);
    if (!node) {
      return;
    }
    node.rect = void 0;
    const connectorKeys = this._store.connectorKeysByNodeId.get(nodeId);
    if (!connectorKeys?.size) {
      return;
    }
    for (const connectorKey of connectorKeys) {
      const connector = this._store.connectorEntries.get(connectorKey);
      if (connector) {
        connector.rect = void 0;
      }
    }
  }
  static ɵfac = function InvalidateFCacheNode_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || InvalidateFCacheNode2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: InvalidateFCacheNode2,
    factory: InvalidateFCacheNode2.ɵfac
  });
};
InvalidateFCacheNode = __decorate([FExecutionRegister(InvalidateFCacheNodeRequest)], InvalidateFCacheNode);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InvalidateFCacheNode, [{
    type: Injectable
  }], null, null);
})();
var RegisterFCacheNodeRequest = class {
  id;
  element;
  reference;
  static fToken = Symbol("RegisterFCacheNodeRequest");
  constructor(id, element, reference) {
    this.id = id;
    this.element = element;
    this.reference = reference;
  }
};
var RegisterFCacheNode = class RegisterFCacheNode2 {
  _store = inject(FCache);
  _options = inject(F_CACHE_OPTIONS);
  handle({
    id,
    element,
    reference
  }) {
    if (!this._options.enabled) {
      return;
    }
    const next = new FCacheNode(id, element, reference);
    this._store.nodeEntries.set(id, next);
    this._store.nodeIdByElement.set(element, id);
    this._store.connectorKeysByNodeId.set(id, this._store.connectorKeysByNodeId.get(id) ?? /* @__PURE__ */ new Set());
  }
  static ɵfac = function RegisterFCacheNode_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RegisterFCacheNode2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RegisterFCacheNode2,
    factory: RegisterFCacheNode2.ɵfac
  });
};
RegisterFCacheNode = __decorate([FExecutionRegister(RegisterFCacheNodeRequest)], RegisterFCacheNode);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RegisterFCacheNode, [{
    type: Injectable
  }], null, null);
})();
var UnregisterFCacheNodeRequest = class {
  id;
  static fToken = Symbol("UnregisterFCacheNodeRequest");
  constructor(id) {
    this.id = id;
  }
};
var UnregisterFCacheNode = class UnregisterFCacheNode2 {
  _store = inject(FCache);
  _mediator = inject(FMediator);
  _options = inject(F_CACHE_OPTIONS);
  handle({
    id
  }) {
    if (!this._options.enabled) {
      return;
    }
    const entry = this._store.nodeEntries.get(id);
    if (!entry) {
      return;
    }
    this._store.nodeEntries.delete(id);
    this._store.nodeIdByElement.delete(entry.element);
    const connectorKeys = Array.from(this._store.connectorKeysByNodeId.get(id) ?? []);
    for (const connectorKey of connectorKeys) {
      const connector = this._store.connectorEntries.get(connectorKey);
      if (!connector) {
        continue;
      }
      this._mediator.execute(new UnregisterFCacheConnectorRequest(connector.id, connector.kind));
    }
    this._store.connectorKeysByNodeId.delete(id);
  }
  static ɵfac = function UnregisterFCacheNode_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || UnregisterFCacheNode2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: UnregisterFCacheNode2,
    factory: UnregisterFCacheNode2.ɵfac
  });
};
UnregisterFCacheNode = __decorate([FExecutionRegister(UnregisterFCacheNodeRequest)], UnregisterFCacheNode);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UnregisterFCacheNode, [{
    type: Injectable
  }], null, null);
})();
var RegisterFCacheConnector = class RegisterFCacheConnector2 {
  _store = inject(FCache);
  _mediator = inject(FMediator);
  _options = inject(F_CACHE_OPTIONS);
  handle({
    id,
    nodeId,
    kind,
    element
  }) {
    if (!this._options.enabled) {
      return;
    }
    const key = FCacheConnectorKeyFactory.build(id, kind);
    const previous = this._store.connectorEntries.get(key);
    if (previous) {
      this._detachConnectorFromNode(previous.key, previous.nodeId);
      this._store.connectorKeyByElement.delete(previous.element);
    }
    const next = new FCacheConnector(key, id, kind, nodeId, element);
    this._store.connectorEntries.set(key, next);
    this._store.connectorKeyByElement.set(element, key);
    const connectorKeys = this._store.connectorKeysByNodeId.get(nodeId) ?? /* @__PURE__ */ new Set();
    connectorKeys.add(key);
    this._store.connectorKeysByNodeId.set(nodeId, connectorKeys);
    this._mediator.execute(new InvalidateFCacheNodeRequest(nodeId, "connector-registered"));
  }
  _detachConnectorFromNode(connectorKey, nodeId) {
    const connectorKeys = this._store.connectorKeysByNodeId.get(nodeId);
    if (!connectorKeys) {
      return;
    }
    connectorKeys.delete(connectorKey);
    if (!connectorKeys.size) {
      this._store.connectorKeysByNodeId.delete(nodeId);
    }
  }
  static ɵfac = function RegisterFCacheConnector_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RegisterFCacheConnector2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RegisterFCacheConnector2,
    factory: RegisterFCacheConnector2.ɵfac
  });
};
RegisterFCacheConnector = __decorate([FExecutionRegister(RegisterFCacheConnectorRequest)], RegisterFCacheConnector);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RegisterFCacheConnector, [{
    type: Injectable
  }], null, null);
})();
var UnregisterFCacheConnectorRequest = class {
  connectorId;
  kind;
  static fToken = Symbol("UnregisterFCacheConnectorRequest");
  constructor(connectorId, kind) {
    this.connectorId = connectorId;
    this.kind = kind;
  }
};
var UnregisterFCacheConnector = class UnregisterFCacheConnector2 {
  _store = inject(FCache);
  _mediator = inject(FMediator);
  _options = inject(F_CACHE_OPTIONS);
  handle({
    connectorId,
    kind
  }) {
    if (!this._options.enabled) {
      return;
    }
    const key = FCacheConnectorKeyFactory.build(connectorId, kind);
    const entry = this._store.connectorEntries.get(key);
    if (!entry) {
      return;
    }
    this._store.connectorEntries.delete(key);
    this._store.connectorKeyByElement.delete(entry.element);
    this._detachConnectorFromNode(key, entry.nodeId);
    if (this._store.nodeEntries.has(entry.nodeId)) {
      this._mediator.execute(new InvalidateFCacheNodeRequest(entry.nodeId, "connector-unregistered"));
    }
  }
  _detachConnectorFromNode(connectorKey, nodeId) {
    const connectorKeys = this._store.connectorKeysByNodeId.get(nodeId);
    if (!connectorKeys) {
      return;
    }
    connectorKeys.delete(connectorKey);
    if (!connectorKeys.size) {
      this._store.connectorKeysByNodeId.delete(nodeId);
    }
  }
  static ɵfac = function UnregisterFCacheConnector_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || UnregisterFCacheConnector2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: UnregisterFCacheConnector2,
    factory: UnregisterFCacheConnector2.ɵfac
  });
};
UnregisterFCacheConnector = __decorate([FExecutionRegister(UnregisterFCacheConnectorRequest)], UnregisterFCacheConnector);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UnregisterFCacheConnector, [{
    type: Injectable
  }], null, null);
})();
var GetCachedFCacheRectRequest = class {
  element;
  static fToken = Symbol("GetCachedFCacheRectRequest");
  constructor(element) {
    this.element = element;
  }
};
var GetCachedFCacheRect = class GetCachedFCacheRect2 {
  _store = inject(FCache);
  _options = inject(F_CACHE_OPTIONS);
  handle({
    element
  }) {
    if (!this._options.enabled) {
      return void 0;
    }
    const nodeId = this._store.nodeIdByElement.get(element);
    if (nodeId) {
      const nodeRect = this._store.nodeEntries.get(nodeId)?.rect;
      if (nodeRect) {
        return nodeRect;
      }
    }
    const key = this._store.connectorKeyByElement.get(element);
    if (!key) {
      return void 0;
    }
    return this._store.connectorEntries.get(key)?.rect ?? void 0;
  }
  static ɵfac = function GetCachedFCacheRect_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || GetCachedFCacheRect2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: GetCachedFCacheRect2,
    factory: GetCachedFCacheRect2.ɵfac
  });
};
GetCachedFCacheRect = __decorate([FExecutionRegister(GetCachedFCacheRectRequest)], GetCachedFCacheRect);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GetCachedFCacheRect, [{
    type: Injectable
  }], null, null);
})();
var SetFCacheConnectorRectRequest = class {
  connectorId;
  kind;
  rect;
  static fToken = Symbol("SetFCacheConnectorRectRequest");
  constructor(connectorId, kind, rect) {
    this.connectorId = connectorId;
    this.kind = kind;
    this.rect = rect;
  }
};
var SetFCacheConnectorRect = class SetFCacheConnectorRect2 {
  _store = inject(FCache);
  _options = inject(F_CACHE_OPTIONS);
  handle({
    connectorId,
    kind,
    rect
  }) {
    if (!this._options.enabled) {
      return;
    }
    const key = FCacheConnectorKeyFactory.build(connectorId, kind);
    const connector = this._store.connectorEntries.get(key);
    if (!connector) {
      return;
    }
    connector.rect = RoundedRect.fromRoundedRect(rect);
  }
  static ɵfac = function SetFCacheConnectorRect_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SetFCacheConnectorRect2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: SetFCacheConnectorRect2,
    factory: SetFCacheConnectorRect2.ɵfac
  });
};
SetFCacheConnectorRect = __decorate([FExecutionRegister(SetFCacheConnectorRectRequest)], SetFCacheConnectorRect);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SetFCacheConnectorRect, [{
    type: Injectable
  }], null, null);
})();
var SetFCacheNodeRectRequest = class {
  nodeId;
  rect;
  static fToken = Symbol("SetFCacheNodeRectRequest");
  constructor(nodeId, rect) {
    this.nodeId = nodeId;
    this.rect = rect;
  }
};
var SetFCacheNodeRect = class SetFCacheNodeRect2 {
  _store = inject(FCache);
  _options = inject(F_CACHE_OPTIONS);
  handle({
    nodeId,
    rect
  }) {
    if (!this._options.enabled) {
      return;
    }
    const node = this._store.nodeEntries.get(nodeId);
    if (!node) {
      return;
    }
    const previousRect = node.rect;
    node.rect = RectExtensions.initialize(rect.x, rect.y, rect.width, rect.height);
    if (!previousRect) {
      return;
    }
    this._updateConnectorRectsByNodeRect(nodeId, previousRect, node.rect);
  }
  _updateConnectorRectsByNodeRect(nodeId, previousRect, nextRect) {
    const connectorKeys = this._store.connectorKeysByNodeId.get(nodeId);
    if (!connectorKeys?.size) {
      return;
    }
    const dx = nextRect.x - previousRect.x;
    const dy = nextRect.y - previousRect.y;
    const hasScaleX = previousRect.width !== 0;
    const hasScaleY = previousRect.height !== 0;
    const scaleX = hasScaleX ? nextRect.width / previousRect.width : 1;
    const scaleY = hasScaleY ? nextRect.height / previousRect.height : 1;
    for (const key of connectorKeys) {
      const connector = this._store.connectorEntries.get(key);
      if (!connector?.rect) {
        continue;
      }
      const previousConnectorRect = connector.rect;
      const previousCenter = previousConnectorRect.gravityCenter;
      const nextCenterX = hasScaleX ? nextRect.x + (previousCenter.x - previousRect.x) * scaleX : previousCenter.x + dx;
      const nextCenterY = hasScaleY ? nextRect.y + (previousCenter.y - previousRect.y) * scaleY : previousCenter.y + dy;
      connector.rect = new RoundedRect(nextCenterX - previousConnectorRect.width / 2, nextCenterY - previousConnectorRect.height / 2, previousConnectorRect.width, previousConnectorRect.height, previousConnectorRect.radius1, previousConnectorRect.radius2, previousConnectorRect.radius3, previousConnectorRect.radius4);
    }
  }
  static ɵfac = function SetFCacheNodeRect_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SetFCacheNodeRect2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: SetFCacheNodeRect2,
    factory: SetFCacheNodeRect2.ɵfac
  });
};
SetFCacheNodeRect = __decorate([FExecutionRegister(SetFCacheNodeRectRequest)], SetFCacheNodeRect);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SetFCacheNodeRect, [{
    type: Injectable
  }], null, null);
})();
var UpdateFCacheRectByElementRequest = class {
  element;
  rect;
  static fToken = Symbol("UpdateFCacheRectByElementRequest");
  constructor(element, rect) {
    this.element = element;
    this.rect = rect;
  }
};
var UpdateFCacheRectByElement = class UpdateFCacheRectByElement2 {
  _store = inject(FCache);
  _options = inject(F_CACHE_OPTIONS);
  handle({
    element,
    rect
  }) {
    if (!this._options.enabled) {
      return;
    }
    const nodeId = this._store.nodeIdByElement.get(element);
    if (nodeId) {
      const node = this._store.nodeEntries.get(nodeId);
      if (node) {
        node.rect = rect;
      }
      return;
    }
    const key = this._store.connectorKeyByElement.get(element);
    if (!key) {
      return;
    }
    const connector = this._store.connectorEntries.get(key);
    if (connector) {
      connector.rect = rect;
    }
  }
  static ɵfac = function UpdateFCacheRectByElement_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || UpdateFCacheRectByElement2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: UpdateFCacheRectByElement2,
    factory: UpdateFCacheRectByElement2.ɵfac
  });
};
UpdateFCacheRectByElement = __decorate([FExecutionRegister(UpdateFCacheRectByElementRequest)], UpdateFCacheRectByElement);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UpdateFCacheRectByElement, [{
    type: Injectable
  }], null, null);
})();
var F_CACHE_FEATURES = [FCache, RegisterFCacheNode, UnregisterFCacheNode, InvalidateFCacheNode, RegisterFCacheConnector, UnregisterFCacheConnector, GetCachedFCacheRect, SetFCacheNodeRect, SetFCacheConnectorRect, UpdateFCacheRectByElement];
function calculatePointerInFlow(position, flowHost, transform) {
  if (!flowHost) {
    return Point.fromPoint(position);
  }
  return Point.fromPoint(position).elementTransform(flowHost).sub(transform.scaledPosition).sub(transform.position).div(transform.scale);
}
function infinityMinMax() {
  return {
    min: {
      x: -Infinity,
      y: -Infinity
    },
    max: {
      x: Infinity,
      y: Infinity
    }
  };
}
function stringAttribute(value) {
  return value ? `${value}` : void 0;
}
var GetNormalizedConnectorRect = class GetNormalizedConnectorRect2 {
  _store = inject(FComponentsStore);
  _mediator = inject(FMediator);
  _browser = inject(BrowserService);
  get _transform() {
    return this._store.transform;
  }
  handle({
    element,
    cache
  }) {
    const cachedRect = this._mediator.execute(new GetCachedFCacheRectRequest(element));
    if (cachedRect && cache) {
      return cachedRect;
    }
    const systemRect = this._getElementRoundedRect(element);
    const position = this._normalizePosition(systemRect);
    const unscaledSize = this._unscaleSize(systemRect);
    const unscaledRect = this._getUnscaledRect(position, unscaledSize, systemRect);
    const offsetSize = this._getOffsetSize(element, unscaledSize);
    const rect = RoundedRect.fromCenter(unscaledRect, offsetSize.width, offsetSize.height);
    this._mediator.execute(new UpdateFCacheRectByElementRequest(element, rect));
    return rect;
  }
  _getElementRoundedRect(element) {
    return this._getRoundedRect(RectExtensions.fromElement(element), element, this._getComputedStyle(element));
  }
  _getRoundedRect(rect, element, styles) {
    const [radius1, radius2, radius3, radius4] = this._normalizeCircularBorderRadii(rect.width, rect.height, [this._getSystemRadius(styles.borderTopLeftRadius, element, styles.fontSize), this._getSystemRadius(styles.borderTopRightRadius, element, styles.fontSize), this._getSystemRadius(styles.borderBottomRightRadius, element, styles.fontSize), this._getSystemRadius(styles.borderBottomLeftRadius, element, styles.fontSize)]);
    return new RoundedRect(rect.x, rect.y, rect.width, rect.height, radius1, radius2, radius3, radius4);
  }
  _getComputedStyle(element) {
    return this._browser.window.getComputedStyle(element);
  }
  _toPixels(value, element, fontSize) {
    return this._browser.toPixels(value, element.clientWidth, element.clientHeight, fontSize) || 0;
  }
  _getSystemRadius(value, element, fontSize) {
    return this._toPixels(value, element, fontSize) * this._transform.scale;
  }
  /**
   * Mirrors CSS border-radius normalization so oversized values like `999px`
   * collapse to the largest valid circular radii for the current rect.
   */
  _normalizeCircularBorderRadii(width, height, radii) {
    const [topLeft, topRight, bottomRight, bottomLeft] = radii.map((value) => Math.max(0, value));
    const scale = Math.min(1, this._getRadiusScaleFactor(width, topLeft + topRight), this._getRadiusScaleFactor(height, topRight + bottomRight), this._getRadiusScaleFactor(width, bottomRight + bottomLeft), this._getRadiusScaleFactor(height, bottomLeft + topLeft));
    return [topLeft * scale, topRight * scale, bottomRight * scale, bottomLeft * scale];
  }
  _getRadiusScaleFactor(limit, sum) {
    if (sum <= 0) {
      return 1;
    }
    if (limit <= 0) {
      return 0;
    }
    return limit / sum;
  }
  _normalizePosition(rect) {
    return calculatePointerInFlow(rect, this._store.flowHost, this._transform);
  }
  _unscaleSize(rect) {
    return SizeExtensions.initialize(rect.width / this._transform.scale, rect.height / this._transform.scale);
  }
  _getUnscaledRect(position, size, rect) {
    return new RoundedRect(position.x, position.y, size.width, size.height, this._unscaleRadius(rect.radius1), this._unscaleRadius(rect.radius2), this._unscaleRadius(rect.radius3), this._unscaleRadius(rect.radius4));
  }
  _unscaleRadius(radius) {
    return radius / this._transform.scale;
  }
  _getOffsetSize(element, size) {
    return SizeExtensions.offsetFromElement(element) || size;
  }
  static ɵfac = function GetNormalizedConnectorRect_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || GetNormalizedConnectorRect2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: GetNormalizedConnectorRect2,
    factory: GetNormalizedConnectorRect2.ɵfac
  });
};
GetNormalizedConnectorRect = __decorate([FExecutionRegister(GetNormalizedConnectorRectRequest)], GetNormalizedConnectorRect);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GetNormalizedConnectorRect, [{
    type: Injectable
  }], null, null);
})();
var ResolveConnectionEndpointRectRequest = class {
  connector;
  cache;
  static fToken = Symbol("ResolveConnectionEndpointRectRequest");
  constructor(connector, cache) {
    this.connector = connector;
    this.cache = cache;
  }
};
var ResolveConnectionEndpointRect = class ResolveConnectionEndpointRect2 {
  _mediator = inject(FMediator);
  handle({
    connector,
    cache
  }) {
    const cacheKey = this._buildCacheKey(connector);
    const rect = cache.get(cacheKey) ?? this._calculateRect(connector);
    cache.set(cacheKey, rect);
    return rect;
  }
  _buildCacheKey(connector) {
    return `${connector.kind}::${connector.fId()}`;
  }
  _calculateRect(connector) {
    return this._mediator.execute(new GetNormalizedConnectorRectRequest(connector.hostElement));
  }
  static ɵfac = function ResolveConnectionEndpointRect_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ResolveConnectionEndpointRect2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ResolveConnectionEndpointRect2,
    factory: ResolveConnectionEndpointRect2.ɵfac
  });
};
ResolveConnectionEndpointRect = __decorate([FExecutionRegister(ResolveConnectionEndpointRectRequest)], ResolveConnectionEndpointRect);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResolveConnectionEndpointRect, [{
    type: Injectable
  }], null, null);
})();
var ResolveConnectionEndpointsRequest = class {
  connection;
  static fToken = Symbol("ResolveConnectionEndpointsRequest");
  constructor(connection) {
    this.connection = connection;
  }
};
var ResolveConnectionEndpoints = class ResolveConnectionEndpoints2 {
  _store = inject(FComponentsStore);
  handle({
    connection
  }) {
    const source = this._store.outputs.get(connection.fOutputId());
    const target = this._store.inputs.get(connection.fInputId());
    if (!source || !target) {
      return null;
    }
    return {
      source,
      target
    };
  }
  static ɵfac = function ResolveConnectionEndpoints_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ResolveConnectionEndpoints2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ResolveConnectionEndpoints2,
    factory: ResolveConnectionEndpoints2.ɵfac
  });
};
ResolveConnectionEndpoints = __decorate([FExecutionRegister(ResolveConnectionEndpointsRequest)], ResolveConnectionEndpoints);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResolveConnectionEndpoints, [{
    type: Injectable
  }], null, null);
})();
var ResolveConnectionGeometryRequest = class {
  connection;
  cache;
  static fToken = Symbol("ResolveConnectionGeometryRequest");
  constructor(connection, cache) {
    this.connection = connection;
    this.cache = cache;
  }
};
var ResolveConnectionGeometry = class ResolveConnectionGeometry2 {
  _mediator = inject(FMediator);
  handle({
    connection,
    cache
  }) {
    const endpoints = this._resolveConnectionEndpoints(connection);
    if (!endpoints) {
      return null;
    }
    return __spreadProps(__spreadValues({}, endpoints), {
      sourceRect: this._resolveEndpointRect(endpoints.source, cache),
      targetRect: this._resolveEndpointRect(endpoints.target, cache)
    });
  }
  _resolveConnectionEndpoints(connection) {
    return this._mediator.execute(new ResolveConnectionEndpointsRequest(connection));
  }
  _resolveEndpointRect(connector, cache) {
    return this._mediator.execute(new ResolveConnectionEndpointRectRequest(connector, cache));
  }
  static ɵfac = function ResolveConnectionGeometry_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ResolveConnectionGeometry2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ResolveConnectionGeometry2,
    factory: ResolveConnectionGeometry2.ɵfac
  });
};
ResolveConnectionGeometry = __decorate([FExecutionRegister(ResolveConnectionGeometryRequest)], ResolveConnectionGeometry);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResolveConnectionGeometry, [{
    type: Injectable
  }], null, null);
})();
var GetNormalizedElementRectRequest = class {
  element;
  static fToken = Symbol("GetNormalizedElementRectRequest");
  constructor(element) {
    this.element = element;
  }
};
var GetNormalizedElementRect = class GetNormalizedElementRect2 {
  _store = inject(FComponentsStore);
  _mediator = inject(FMediator);
  get _transform() {
    return this._store.transform;
  }
  handle({
    element
  }) {
    const cachedRect = this._mediator.execute(new GetCachedFCacheRectRequest(element));
    if (cachedRect) {
      return cachedRect;
    }
    const systemRect = RectExtensions.fromElement(element);
    const position = this._normalizePosition(systemRect);
    const unscaledSize = this._unscaleSize(systemRect);
    const unscaledRect = this._getUnscaledRect(position, unscaledSize);
    const offsetSize = this._getOffsetSize(element, unscaledSize);
    const rect = this._fromCenter(unscaledRect, offsetSize.width, offsetSize.height);
    this._mediator.execute(new UpdateFCacheRectByElementRequest(element, rect));
    return rect;
  }
  _fromCenter(rect, width, height) {
    return RectExtensions.initialize(rect.gravityCenter.x - width / 2, rect.gravityCenter.y - height / 2, width, height);
  }
  _normalizePosition(rect) {
    return calculatePointerInFlow(rect, this._store.flowHost, this._transform);
  }
  _unscaleSize(rect) {
    return SizeExtensions.initialize(rect.width / this._transform.scale, rect.height / this._transform.scale);
  }
  _getUnscaledRect(position, size) {
    return new RoundedRect(position.x, position.y, size.width, size.height);
  }
  _getOffsetSize(element, size) {
    return SizeExtensions.offsetFromElement(element) || size;
  }
  static ɵfac = function GetNormalizedElementRect_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || GetNormalizedElementRect2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: GetNormalizedElementRect2,
    factory: GetNormalizedElementRect2.ɵfac
  });
};
GetNormalizedElementRect = __decorate([FExecutionRegister(GetNormalizedElementRectRequest)], GetNormalizedElementRect);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GetNormalizedElementRect, [{
    type: Injectable
  }], null, null);
})();
var ResolveConnectionEndpointRotationContextRequest = class {
  connector;
  static fToken = Symbol("ResolveConnectionEndpointRotationContextRequest");
  constructor(connector) {
    this.connector = connector;
  }
};
var ResolveConnectionEndpointRotationContext = class ResolveConnectionEndpointRotationContext2 {
  _store = inject(FComponentsStore);
  _mediator = inject(FMediator);
  handle({
    connector
  }) {
    if (!connector) {
      return void 0;
    }
    const node = this._store.nodes.get(connector.fNodeId);
    if (!node || !node._rotate) {
      return void 0;
    }
    const nodeRect = this._mediator.execute(new GetNormalizedElementRectRequest(node.hostElement));
    return {
      rotationDeg: node._rotate,
      pivot: nodeRect.gravityCenter
    };
  }
  static ɵfac = function ResolveConnectionEndpointRotationContext_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ResolveConnectionEndpointRotationContext2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ResolveConnectionEndpointRotationContext2,
    factory: ResolveConnectionEndpointRotationContext2.ɵfac
  });
};
ResolveConnectionEndpointRotationContext = __decorate([FExecutionRegister(ResolveConnectionEndpointRotationContextRequest)], ResolveConnectionEndpointRotationContext);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResolveConnectionEndpointRotationContext, [{
    type: Injectable
  }], null, null);
})();
var BuildConnectionLineRequest = class {
  connection;
  geometry;
  static fToken = Symbol("BuildConnectionLineRequest");
  constructor(connection, geometry) {
    this.connection = connection;
    this.geometry = geometry;
  }
};
var BuildConnectionLine = class BuildConnectionLine2 {
  _mediator = inject(FMediator);
  _connectionBehaviour = inject(ConnectionBehaviourBuilder);
  handle({
    connection,
    geometry
  }) {
    return this._connectionBehaviour.handle(new ConnectionBehaviourBuilderRequest(geometry.sourceRect, geometry.targetRect, connection, geometry.source.fConnectableSide, geometry.target.fConnectableSide, this._resolveRotationContext(geometry.source), this._resolveRotationContext(geometry.target)));
  }
  _resolveRotationContext(connector) {
    return this._mediator.execute(new ResolveConnectionEndpointRotationContextRequest(connector));
  }
  static ɵfac = function BuildConnectionLine_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || BuildConnectionLine2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: BuildConnectionLine2,
    factory: BuildConnectionLine2.ɵfac
  });
};
BuildConnectionLine = __decorate([FExecutionRegister(BuildConnectionLineRequest)], BuildConnectionLine);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BuildConnectionLine, [{
    type: Injectable
  }], null, null);
})();
var RenderConnectionWithLineRequest = class {
  connection;
  source;
  target;
  line;
  static fToken = Symbol("RenderConnectionWithLineRequest");
  constructor(connection, source, target, line) {
    this.connection = connection;
    this.source = source;
    this.target = target;
    this.line = line;
  }
};
var RenderConnectionWithLine = class RenderConnectionWithLine2 {
  _mediator = inject(FMediator);
  handle({
    connection,
    source,
    target,
    line
  }) {
    this._mediator.execute(new MarkConnectionConnectorsAsConnectedRequest(source, target));
    this._mediator.execute(new ApplyConnectionRenderRequest(connection, line));
  }
  static ɵfac = function RenderConnectionWithLine_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RenderConnectionWithLine2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RenderConnectionWithLine2,
    factory: RenderConnectionWithLine2.ɵfac
  });
};
RenderConnectionWithLine = __decorate([FExecutionRegister(RenderConnectionWithLineRequest)], RenderConnectionWithLine);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RenderConnectionWithLine, [{
    type: Injectable
  }], null, null);
})();
var RenderConnectionFromGeometryRequest = class {
  connection;
  geometry;
  static fToken = Symbol("RenderConnectionFromGeometryRequest");
  constructor(connection, geometry) {
    this.connection = connection;
    this.geometry = geometry;
  }
};
var RenderConnectionFromGeometry = class RenderConnectionFromGeometry2 {
  _mediator = inject(FMediator);
  handle({
    connection,
    geometry
  }) {
    const line = this._mediator.execute(new BuildConnectionLineRequest(connection, geometry));
    this._mediator.execute(new RenderConnectionWithLineRequest(connection, geometry.source, geometry.target, line));
  }
  static ɵfac = function RenderConnectionFromGeometry_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RenderConnectionFromGeometry2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RenderConnectionFromGeometry2,
    factory: RenderConnectionFromGeometry2.ɵfac
  });
};
RenderConnectionFromGeometry = __decorate([FExecutionRegister(RenderConnectionFromGeometryRequest)], RenderConnectionFromGeometry);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RenderConnectionFromGeometry, [{
    type: Injectable
  }], null, null);
})();
var RenderConnectionRequest = class {
  connection;
  cache;
  static fToken = Symbol("RenderConnectionRequest");
  constructor(connection, cache) {
    this.connection = connection;
    this.cache = cache;
  }
};
var RenderConnection = class RenderConnection2 {
  _mediator = inject(FMediator);
  handle({
    connection,
    cache
  }) {
    const geometry = this._mediator.execute(new ResolveConnectionGeometryRequest(connection, cache));
    if (!geometry) {
      return;
    }
    this._mediator.execute(new RenderConnectionFromGeometryRequest(connection, geometry));
  }
  static ɵfac = function RenderConnection_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RenderConnection2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RenderConnection2,
    factory: RenderConnection2.ɵfac
  });
};
RenderConnection = __decorate([FExecutionRegister(RenderConnectionRequest)], RenderConnection);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RenderConnection, [{
    type: Injectable
  }], null, null);
})();
var IsConnectionRedrawCurrentRequest = class {
  session;
  static fToken = Symbol("IsConnectionRedrawCurrentRequest");
  constructor(session) {
    this.session = session;
  }
};
var IsConnectionRedrawCurrent = class IsConnectionRedrawCurrent2 {
  _store = inject(FComponentsStore);
  _state = inject(ConnectionRedrawState);
  handle({
    session
  }) {
    return session.renderTicket === this._state.renderTicket && session.nodesRevision === this._store.nodesRevision;
  }
  static ɵfac = function IsConnectionRedrawCurrent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || IsConnectionRedrawCurrent2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: IsConnectionRedrawCurrent2,
    factory: IsConnectionRedrawCurrent2.ɵfac
  });
};
IsConnectionRedrawCurrent = __decorate([FExecutionRegister(IsConnectionRedrawCurrentRequest)], IsConnectionRedrawCurrent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(IsConnectionRedrawCurrent, [{
    type: Injectable
  }], null, null);
})();
var CompleteConnectionRedrawRequest = class {
  session;
  static fToken = Symbol("CompleteConnectionRedrawRequest");
  constructor(session) {
    this.session = session;
  }
};
var CompleteConnectionRedraw = class CompleteConnectionRedraw2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  handle({
    session
  }) {
    if (!this._mediator.execute(new IsConnectionRedrawCurrentRequest(session))) {
      return;
    }
    this._store.completeConnectionsRender(session.connectionsRevision, session.nodesRevision);
  }
  static ɵfac = function CompleteConnectionRedraw_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CompleteConnectionRedraw2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CompleteConnectionRedraw2,
    factory: CompleteConnectionRedraw2.ɵfac
  });
};
CompleteConnectionRedraw = __decorate([FExecutionRegister(CompleteConnectionRedrawRequest)], CompleteConnectionRedraw);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CompleteConnectionRedraw, [{
    type: Injectable
  }], null, null);
})();
var ApplyConnectionWorkerResultRequest = class {
  batchItem;
  result;
  static fToken = Symbol("ApplyConnectionWorkerResultRequest");
  constructor(batchItem, result) {
    this.batchItem = batchItem;
    this.result = result;
  }
};
var ApplyConnectionWorkerResult = class ApplyConnectionWorkerResult2 {
  _mediator = inject(FMediator);
  handle({
    batchItem,
    result
  }) {
    if (!batchItem) {
      return;
    }
    if (!this._isSupportedWorkerResult(result)) {
      this._fallbackToMainThread(batchItem);
      return;
    }
    try {
      batchItem.connection._applyResolvedSidesToConnection(result.sourceSide, result.targetSide);
      this._mediator.execute(new RenderConnectionWithLineRequest(batchItem.connection, batchItem.geometry.source, batchItem.geometry.target, result.line));
    } catch {
      this._fallbackToMainThread(batchItem);
    }
  }
  _fallbackToMainThread(batchItem) {
    this._mediator.execute(new RenderConnectionFromGeometryRequest(batchItem.connection, batchItem.geometry));
  }
  _isSupportedWorkerResult(result) {
    return !!(result?.supported && result.sourceSide && result.targetSide && result.line);
  }
  static ɵfac = function ApplyConnectionWorkerResult_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ApplyConnectionWorkerResult2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ApplyConnectionWorkerResult2,
    factory: ApplyConnectionWorkerResult2.ɵfac
  });
};
ApplyConnectionWorkerResult = __decorate([FExecutionRegister(ApplyConnectionWorkerResultRequest)], ApplyConnectionWorkerResult);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ApplyConnectionWorkerResult, [{
    type: Injectable
  }], null, null);
})();
var RunConnectionRedrawSliceRequest = class {
  connections;
  cache;
  startIndex;
  session;
  batchItems;
  workerResults;
  static fToken = Symbol("RunConnectionRedrawSliceRequest");
  constructor(connections, cache, startIndex, session, batchItems, workerResults) {
    this.connections = connections;
    this.cache = cache;
    this.startIndex = startIndex;
    this.session = session;
    this.batchItems = batchItems;
    this.workerResults = workerResults;
  }
};
var CONNECTIONS_PER_SLICE_LIMIT = 500;
var SLICE_BUDGET_MS = 6;
var RunConnectionRedrawSlice = class RunConnectionRedrawSlice2 {
  _mediator = inject(FMediator);
  _browser = inject(BrowserService);
  handle({
    connections,
    cache,
    startIndex,
    session,
    batchItems,
    workerResults
  }) {
    if (!this._isCurrent(session)) {
      return;
    }
    const sliceStart = this._now();
    let endIndex = startIndex;
    let processed = 0;
    while (endIndex < connections.length && processed < CONNECTIONS_PER_SLICE_LIMIT && this._isWithinSliceBudget(sliceStart)) {
      const connection = connections[endIndex];
      if (batchItems) {
        this._mediator.execute(new ApplyConnectionWorkerResultRequest(batchItems[endIndex] ?? null, workerResults?.[endIndex]));
      } else {
        this._mediator.execute(new RenderConnectionRequest(connection, cache));
      }
      endIndex++;
      processed++;
      if (!this._isCurrent(session)) {
        return;
      }
    }
    if (endIndex >= connections.length) {
      this._mediator.execute(new CompleteConnectionRedrawRequest(session));
      return;
    }
    this._requestAnimationFrame(() => this._mediator.execute(new RunConnectionRedrawSliceRequest(connections, cache, endIndex, session, batchItems, workerResults)));
  }
  _isCurrent(session) {
    return this._mediator.execute(new IsConnectionRedrawCurrentRequest(session));
  }
  _requestAnimationFrame(callback) {
    const windowRef = this._browser.document.defaultView;
    if (!windowRef) {
      callback();
      return;
    }
    windowRef.requestAnimationFrame(callback);
  }
  _now() {
    const performanceRef = this._browser.document.defaultView?.performance;
    return performanceRef ? performanceRef.now() : Date.now();
  }
  _isWithinSliceBudget(sliceStart) {
    if (!this._browser.isBrowser()) {
      return true;
    }
    return this._now() - sliceStart < SLICE_BUDGET_MS;
  }
  static ɵfac = function RunConnectionRedrawSlice_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RunConnectionRedrawSlice2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RunConnectionRedrawSlice2,
    factory: RunConnectionRedrawSlice2.ɵfac
  });
};
RunConnectionRedrawSlice = __decorate([FExecutionRegister(RunConnectionRedrawSliceRequest)], RunConnectionRedrawSlice);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RunConnectionRedrawSlice, [{
    type: Injectable
  }], null, null);
})();
var StartConnectionRedrawRequest = class {
  static fToken = Symbol("StartConnectionRedrawRequest");
};
var StartConnectionRedraw = class StartConnectionRedraw2 {
  _store = inject(FComponentsStore);
  _state = inject(ConnectionRedrawState);
  handle(_) {
    this._state.resetConnectedConnectors();
    return {
      renderTicket: this._state.beginRender(),
      connectionsRevision: this._store.connectionsRevision,
      nodesRevision: this._store.nodesRevision
    };
  }
  static ɵfac = function StartConnectionRedraw_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || StartConnectionRedraw2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: StartConnectionRedraw2,
    factory: StartConnectionRedraw2.ɵfac
  });
};
StartConnectionRedraw = __decorate([FExecutionRegister(StartConnectionRedrawRequest)], StartConnectionRedraw);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StartConnectionRedraw, [{
    type: Injectable
  }], null, null);
})();
var RedrawConnectionsRequest = class {
  static fToken = Symbol("RedrawConnectionsRequest");
};
var ShouldUseConnectionWorkerRequest = class {
  connectionCount;
  static fToken = Symbol("ShouldUseConnectionWorkerRequest");
  constructor(connectionCount) {
    this.connectionCount = connectionCount;
  }
};
var IsConnectionWorkerEnabledRequest = class {
  static fToken = Symbol("IsConnectionWorkerEnabledRequest");
};
var IsConnectionWorkerEnabled = class IsConnectionWorkerEnabled2 {
  _browser = inject(BrowserService);
  _state = inject(ConnectionWorkerState);
  handle(_) {
    if (this._state.isDisabled) {
      return false;
    }
    if (!this._isWorkerAvailable()) {
      return false;
    }
    const windowRef = this._browser.document.defaultView;
    return isConnectionWorkerRuntimeSupported(windowRef);
  }
  _isWorkerAvailable() {
    return this._browser.isBrowser();
  }
  static ɵfac = function IsConnectionWorkerEnabled_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || IsConnectionWorkerEnabled2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: IsConnectionWorkerEnabled2,
    factory: IsConnectionWorkerEnabled2.ɵfac
  });
};
IsConnectionWorkerEnabled = __decorate([FExecutionRegister(IsConnectionWorkerEnabledRequest)], IsConnectionWorkerEnabled);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(IsConnectionWorkerEnabled, [{
    type: Injectable
  }], null, null);
})();
var ShouldUseConnectionWorker = class ShouldUseConnectionWorker2 {
  _mediator = inject(FMediator);
  handle({
    connectionCount
  }) {
    return connectionCount > 0 && this._mediator.execute(new IsConnectionWorkerEnabledRequest());
  }
  static ɵfac = function ShouldUseConnectionWorker_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ShouldUseConnectionWorker2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ShouldUseConnectionWorker2,
    factory: ShouldUseConnectionWorker2.ɵfac
  });
};
ShouldUseConnectionWorker = __decorate([FExecutionRegister(ShouldUseConnectionWorkerRequest)], ShouldUseConnectionWorker);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ShouldUseConnectionWorker, [{
    type: Injectable
  }], null, null);
})();
var BuildConnectionWorkerPayloadItemRequest = class {
  connection;
  geometry;
  originalIndex;
  static fToken = Symbol("BuildConnectionWorkerPayloadItemRequest");
  constructor(connection, geometry, originalIndex) {
    this.connection = connection;
    this.geometry = geometry;
    this.originalIndex = originalIndex;
  }
};
var BuildConnectionWorkerPayloadItem = class BuildConnectionWorkerPayloadItem2 {
  _store = inject(FComponentsStore);
  handle({
    connection,
    geometry,
    originalIndex
  }) {
    const {
      source,
      target,
      sourceRect,
      targetRect
    } = geometry;
    return {
      originalIndex,
      behavior: connection.fBehavior,
      outputSide: connection.fOutputSide(),
      inputSide: connection.fInputSide(),
      sourceConnectableSide: source.fConnectableSide,
      targetConnectableSide: target.fConnectableSide,
      sourceRotation: this._store.nodes.get(source.fNodeId)?._rotate || 0,
      targetRotation: this._store.nodes.get(target.fNodeId)?._rotate || 0,
      sourceRect: {
        x: sourceRect.x,
        y: sourceRect.y,
        width: sourceRect.width,
        height: sourceRect.height,
        radius1: sourceRect.radius1,
        radius2: sourceRect.radius2,
        radius3: sourceRect.radius3,
        radius4: sourceRect.radius4
      },
      targetRect: {
        x: targetRect.x,
        y: targetRect.y,
        width: targetRect.width,
        height: targetRect.height,
        radius1: targetRect.radius1,
        radius2: targetRect.radius2,
        radius3: targetRect.radius3,
        radius4: targetRect.radius4
      }
    };
  }
  static ɵfac = function BuildConnectionWorkerPayloadItem_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || BuildConnectionWorkerPayloadItem2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: BuildConnectionWorkerPayloadItem2,
    factory: BuildConnectionWorkerPayloadItem2.ɵfac
  });
};
BuildConnectionWorkerPayloadItem = __decorate([FExecutionRegister(BuildConnectionWorkerPayloadItemRequest)], BuildConnectionWorkerPayloadItem);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BuildConnectionWorkerPayloadItem, [{
    type: Injectable
  }], null, null);
})();
var BuildConnectionWorkerBatchRequest = class {
  connections;
  cache;
  static fToken = Symbol("BuildConnectionWorkerBatchRequest");
  constructor(connections, cache) {
    this.connections = connections;
    this.cache = cache;
  }
};
var BuildConnectionWorkerBatch = class BuildConnectionWorkerBatch2 {
  _mediator = inject(FMediator);
  handle({
    connections,
    cache
  }) {
    const items = new Array(connections.length);
    const payload = [];
    for (let index = 0; index < connections.length; index++) {
      const item = this._buildBatchItem(connections[index], cache, index);
      items[index] = item;
      if (!item) {
        continue;
      }
      payload.push(item.payload);
    }
    return {
      items,
      payload
    };
  }
  _buildBatchItem(connection, cache, originalIndex) {
    const geometry = this._mediator.execute(new ResolveConnectionGeometryRequest(connection, cache));
    if (!geometry) {
      return null;
    }
    return {
      connection,
      geometry,
      payload: this._mediator.execute(new BuildConnectionWorkerPayloadItemRequest(connection, geometry, originalIndex))
    };
  }
  static ɵfac = function BuildConnectionWorkerBatch_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || BuildConnectionWorkerBatch2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: BuildConnectionWorkerBatch2,
    factory: BuildConnectionWorkerBatch2.ɵfac
  });
};
BuildConnectionWorkerBatch = __decorate([FExecutionRegister(BuildConnectionWorkerBatchRequest)], BuildConnectionWorkerBatch);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BuildConnectionWorkerBatch, [{
    type: Injectable
  }], null, null);
})();
var DisableConnectionWorkerRequest = class {
  error;
  static fToken = Symbol("DisableConnectionWorkerRequest");
  constructor(error) {
    this.error = error;
  }
};
var ResetConnectionWorkerRuntimeRequest = class {
  error;
  static fToken = Symbol("ResetConnectionWorkerRuntimeRequest");
  constructor(error) {
    this.error = error;
  }
};
var ResetConnectionWorkerRuntime = class ResetConnectionWorkerRuntime2 {
  _state = inject(ConnectionWorkerState);
  handle({
    error
  }) {
    this._state.resetRuntime(error);
  }
  static ɵfac = function ResetConnectionWorkerRuntime_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ResetConnectionWorkerRuntime2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ResetConnectionWorkerRuntime2,
    factory: ResetConnectionWorkerRuntime2.ɵfac
  });
};
ResetConnectionWorkerRuntime = __decorate([FExecutionRegister(ResetConnectionWorkerRuntimeRequest)], ResetConnectionWorkerRuntime);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResetConnectionWorkerRuntime, [{
    type: Injectable
  }], null, null);
})();
var DisableConnectionWorker = class DisableConnectionWorker2 {
  _state = inject(ConnectionWorkerState);
  _mediator = inject(FMediator);
  handle({
    error
  }) {
    this._state.isDisabled = true;
    this._mediator.execute(new ResetConnectionWorkerRuntimeRequest(error));
  }
  static ɵfac = function DisableConnectionWorker_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || DisableConnectionWorker2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: DisableConnectionWorker2,
    factory: DisableConnectionWorker2.ɵfac
  });
};
DisableConnectionWorker = __decorate([FExecutionRegister(DisableConnectionWorkerRequest)], DisableConnectionWorker);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DisableConnectionWorker, [{
    type: Injectable
  }], null, null);
})();
var HandleConnectionWorkerMessageRequest = class {
  message;
  static fToken = Symbol("HandleConnectionWorkerMessageRequest");
  constructor(message) {
    this.message = message;
  }
};
var HandleConnectionWorkerMessage = class HandleConnectionWorkerMessage2 {
  _state = inject(ConnectionWorkerState);
  handle({
    message
  }) {
    if (!message || typeof message.requestId !== "number") {
      return;
    }
    const request = this._state.pending.get(message.requestId);
    if (!request) {
      return;
    }
    this._state.pending.delete(message.requestId);
    if (message.error) {
      request.reject(new Error(message.error));
      return;
    }
    request.resolve(message.results ?? []);
  }
  static ɵfac = function HandleConnectionWorkerMessage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || HandleConnectionWorkerMessage2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: HandleConnectionWorkerMessage2,
    factory: HandleConnectionWorkerMessage2.ɵfac
  });
};
HandleConnectionWorkerMessage = __decorate([FExecutionRegister(HandleConnectionWorkerMessageRequest)], HandleConnectionWorkerMessage);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HandleConnectionWorkerMessage, [{
    type: Injectable
  }], null, null);
})();
var EnsureConnectionWorkerRequest = class {
  static fToken = Symbol("EnsureConnectionWorkerRequest");
};
var EnsureConnectionWorker = class EnsureConnectionWorker2 {
  _browser = inject(BrowserService);
  _state = inject(ConnectionWorkerState);
  _mediator = inject(FMediator);
  handle(_) {
    if (this._state.worker) {
      return this._state.worker;
    }
    const windowRef = this._browser.document.defaultView;
    if (!isConnectionWorkerRuntimeSupported(windowRef)) {
      return null;
    }
    const runtime = resolveConnectionWorkerRuntime(windowRef);
    if (!runtime) {
      return null;
    }
    const workerUrl = createConnectionWorkerUrl(runtime);
    try {
      const worker = new runtime.workerCtor(workerUrl, {
        name: "f-flow-connection-worker"
      });
      worker.onmessage = (event) => {
        this._mediator.execute(new HandleConnectionWorkerMessageRequest(event.data));
      };
      worker.onerror = () => {
        this._resetWorkerAfterRuntimeError(new Error("Connection worker runtime error."));
      };
      worker.onmessageerror = () => {
        this._resetWorkerAfterRuntimeError(new Error("Connection worker message deserialization error."));
      };
      this._state.workerUrl = workerUrl;
      this._state.worker = worker;
      return worker;
    } catch (error) {
      revokeConnectionWorkerUrl(workerUrl, runtime.urlApi);
      this._disableWorker(error instanceof Error ? error : new Error("Connection worker initialization failed."));
      return null;
    }
  }
  _disableWorker(error) {
    this._mediator.execute(new DisableConnectionWorkerRequest(error));
  }
  _resetWorkerAfterRuntimeError(error) {
    this._mediator.execute(new ResetConnectionWorkerRuntimeRequest(error));
  }
  static ɵfac = function EnsureConnectionWorker_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || EnsureConnectionWorker2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: EnsureConnectionWorker2,
    factory: EnsureConnectionWorker2.ɵfac
  });
};
EnsureConnectionWorker = __decorate([FExecutionRegister(EnsureConnectionWorkerRequest)], EnsureConnectionWorker);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EnsureConnectionWorker, [{
    type: Injectable
  }], null, null);
})();
var RunConnectionWorkerRequest = class {
  payload;
  static fToken = Symbol("RunConnectionWorkerRequest");
  constructor(payload) {
    this.payload = payload;
  }
};
var RunConnectionWorker = class RunConnectionWorker2 {
  _state = inject(ConnectionWorkerState);
  _mediator = inject(FMediator);
  handle({
    payload
  }) {
    if (!payload.length) {
      return Promise.resolve([]);
    }
    if (!this._mediator.execute(new IsConnectionWorkerEnabledRequest())) {
      return Promise.reject(new Error("Connection worker is disabled."));
    }
    this._interruptPendingRequests();
    const worker = this._mediator.execute(new EnsureConnectionWorkerRequest());
    if (!worker) {
      return Promise.reject(new Error("Unable to initialize connection worker."));
    }
    const requestId = ++this._state.nextRequestId;
    return new Promise((resolve, reject) => {
      this._state.pending.set(requestId, {
        resolve,
        reject
      });
      try {
        worker.postMessage({
          requestId,
          items: payload
        });
      } catch (error) {
        this._state.pending.delete(requestId);
        reject(error instanceof Error ? error : new Error("Unknown error while posting message to connection worker."));
      }
    });
  }
  _interruptPendingRequests() {
    if (!this._state.pending.size) {
      return;
    }
    const error = new Error("Connection worker request was superseded by a newer redraw.");
    this._state.pending.forEach((request) => request.reject(error));
    this._state.pending.clear();
  }
  static ɵfac = function RunConnectionWorker_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RunConnectionWorker2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RunConnectionWorker2,
    factory: RunConnectionWorker2.ɵfac
  });
};
RunConnectionWorker = __decorate([FExecutionRegister(RunConnectionWorkerRequest)], RunConnectionWorker);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RunConnectionWorker, [{
    type: Injectable
  }], null, null);
})();
var RunConnectionWorkerBatchRequest = class {
  batch;
  static fToken = Symbol("RunConnectionWorkerBatchRequest");
  constructor(batch) {
    this.batch = batch;
  }
};
var RunConnectionWorkerBatch = class RunConnectionWorkerBatch2 {
  _mediator = inject(FMediator);
  handle({
    batch
  }) {
    if (!batch.payload.length) {
      return Promise.resolve([]);
    }
    return this._mediator.execute(new RunConnectionWorkerRequest(batch.payload));
  }
  static ɵfac = function RunConnectionWorkerBatch_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RunConnectionWorkerBatch2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RunConnectionWorkerBatch2,
    factory: RunConnectionWorkerBatch2.ɵfac
  });
};
RunConnectionWorkerBatch = __decorate([FExecutionRegister(RunConnectionWorkerBatchRequest)], RunConnectionWorkerBatch);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RunConnectionWorkerBatch, [{
    type: Injectable
  }], null, null);
})();
var StartConnectionWorkerRedrawRequest = class {
  connections;
  cache;
  session;
  static fToken = Symbol("StartConnectionWorkerRedrawRequest");
  constructor(connections, cache, session) {
    this.connections = connections;
    this.cache = cache;
    this.session = session;
  }
};
var StartConnectionWorkerRedraw = class StartConnectionWorkerRedraw2 {
  _mediator = inject(FMediator);
  handle({
    connections,
    cache,
    session
  }) {
    const batch = this._mediator.execute(new BuildConnectionWorkerBatchRequest(connections, cache));
    if (!batch.payload.length) {
      this._mediator.execute(new RunConnectionRedrawSliceRequest(connections, cache, 0, session, batch.items));
      return;
    }
    this._mediator.execute(new RunConnectionWorkerBatchRequest(batch)).then((results) => {
      if (!this._mediator.execute(new IsConnectionRedrawCurrentRequest(session))) {
        return;
      }
      this._mediator.execute(new RunConnectionRedrawSliceRequest(connections, cache, 0, session, batch.items, this._alignWorkerResults(results, connections.length)));
    }).catch(() => {
      if (!this._mediator.execute(new IsConnectionRedrawCurrentRequest(session))) {
        return;
      }
      this._mediator.execute(new RunConnectionRedrawSliceRequest(connections, cache, 0, session, batch.items));
    });
  }
  _alignWorkerResults(results, connectionCount) {
    const aligned = new Array(connectionCount);
    for (const result of results) {
      const index = result.originalIndex;
      if (index < 0 || index >= connectionCount) {
        continue;
      }
      aligned[index] = result;
    }
    return aligned;
  }
  static ɵfac = function StartConnectionWorkerRedraw_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || StartConnectionWorkerRedraw2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: StartConnectionWorkerRedraw2,
    factory: StartConnectionWorkerRedraw2.ɵfac
  });
};
StartConnectionWorkerRedraw = __decorate([FExecutionRegister(StartConnectionWorkerRedrawRequest)], StartConnectionWorkerRedraw);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StartConnectionWorkerRedraw, [{
    type: Injectable
  }], null, null);
})();
var RedrawConnections = class RedrawConnections2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  handle(_) {
    const session = this._mediator.execute(new StartConnectionRedrawRequest());
    this._createMarkersForCreate();
    this._createMarkersForSnap();
    const connections = [...this._store.connections.getAll()];
    const connectorRectCache = /* @__PURE__ */ new Map();
    if (!connections.length) {
      this._mediator.execute(new CompleteConnectionRedrawRequest(session));
      return;
    }
    if (this._shouldUseConnectionWorker(connections.length)) {
      this._redrawUsingWorker(connections, connectorRectCache, session);
    } else {
      this._redrawWithoutWorker(connections, connectorRectCache, session);
    }
  }
  _createMarkersForCreate() {
    const instance = this._store.connections.getForCreate();
    if (instance) {
      this._mediator.execute(new CreateConnectionMarkersRequest(instance));
    }
  }
  _createMarkersForSnap() {
    const instance = this._store.connections.getForSnap();
    if (instance) {
      this._mediator.execute(new CreateConnectionMarkersRequest(instance));
    }
  }
  _shouldUseConnectionWorker(connectionLength) {
    return this._mediator.execute(new ShouldUseConnectionWorkerRequest(connectionLength));
  }
  _redrawUsingWorker(connections, cache, session) {
    this._mediator.execute(new StartConnectionWorkerRedrawRequest(connections, cache, session));
  }
  _redrawWithoutWorker(connections, cache, session) {
    this._mediator.execute(new RunConnectionRedrawSliceRequest(connections, cache, 0, session));
  }
  static ɵfac = function RedrawConnections_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RedrawConnections2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RedrawConnections2,
    factory: RedrawConnections2.ɵfac
  });
};
RedrawConnections = __decorate([FExecutionRegister(RedrawConnectionsRequest)], RedrawConnections);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RedrawConnections, [{
    type: Injectable
  }], null, null);
})();
var RemoveConnectionForCreateFromStoreRequest = class {
  static fToken = Symbol("RemoveConnectionForCreateFromStoreRequest");
};
var RemoveConnectionForCreateFromStore = class RemoveConnectionForCreateFromStore2 {
  _store = inject(FComponentsStore);
  handle(_request) {
    this._store.connections.removeInstanceForCreate();
  }
  static ɵfac = function RemoveConnectionForCreateFromStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RemoveConnectionForCreateFromStore2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RemoveConnectionForCreateFromStore2,
    factory: RemoveConnectionForCreateFromStore2.ɵfac
  });
};
RemoveConnectionForCreateFromStore = __decorate([FExecutionRegister(RemoveConnectionForCreateFromStoreRequest)], RemoveConnectionForCreateFromStore);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RemoveConnectionForCreateFromStore, [{
    type: Injectable
  }], null, null);
})();
var RemoveConnectionFromStoreRequest = class {
  connection;
  static fToken = Symbol("RemoveConnectionFromStoreRequest");
  constructor(connection) {
    this.connection = connection;
  }
};
var RemoveConnectionFromStore = class RemoveConnectionFromStore2 {
  _store = inject(FComponentsStore);
  handle({
    connection
  }) {
    this._store.connections.remove(connection);
    this._store.emitConnectionChanges();
  }
  static ɵfac = function RemoveConnectionFromStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RemoveConnectionFromStore2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RemoveConnectionFromStore2,
    factory: RemoveConnectionFromStore2.ɵfac
  });
};
RemoveConnectionFromStore = __decorate([FExecutionRegister(RemoveConnectionFromStoreRequest)], RemoveConnectionFromStore);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RemoveConnectionFromStore, [{
    type: Injectable
  }], null, null);
})();
var RemoveConnectionMarkerFromStoreRequest = class {
  instance;
  static fToken = Symbol("RemoveConnectionMarkerFromStoreRequest");
  constructor(instance) {
    this.instance = instance;
  }
};
var RemoveConnectionMarkerFromStore = class RemoveConnectionMarkerFromStore2 {
  _store = inject(FComponentsStore);
  handle({
    instance
  }) {
    this._store.connectionMarkers.remove(instance);
    this._store.emitNodeChanges();
  }
  static ɵfac = function RemoveConnectionMarkerFromStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RemoveConnectionMarkerFromStore2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RemoveConnectionMarkerFromStore2,
    factory: RemoveConnectionMarkerFromStore2.ɵfac
  });
};
RemoveConnectionMarkerFromStore = __decorate([FExecutionRegister(RemoveConnectionMarkerFromStoreRequest)], RemoveConnectionMarkerFromStore);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RemoveConnectionMarkerFromStore, [{
    type: Injectable
  }], null, null);
})();
var RemoveConnectionWaypointRequest = class {
  waypointIndex;
  connectionId;
  static fToken = Symbol("RemoveConnectionWaypointRequest");
  constructor(waypointIndex, connectionId) {
    this.waypointIndex = waypointIndex;
    this.connectionId = connectionId;
  }
};
var EmitEndDragSequenceEventRequest = class {
  static fToken = Symbol("EmitEndDragSequenceEventRequest");
};
var EmitEndDragSequenceEvent = class EmitEndDragSequenceEvent2 {
  _store = inject(FComponentsStore);
  _dragSession = inject(FDraggableDataContext);
  handle(_request) {
    this._store.flowHost.classList.remove(F_CSS_CLASS.DRAG_AND_DROP.DRAGGING);
    this._dragSession.reset();
    this._emitEvent();
  }
  _emitEvent() {
    this._store.fDraggable?.fDragEnded?.emit();
  }
  static ɵfac = function EmitEndDragSequenceEvent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || EmitEndDragSequenceEvent2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: EmitEndDragSequenceEvent2,
    factory: EmitEndDragSequenceEvent2.ɵfac
  });
};
EmitEndDragSequenceEvent = __decorate([FExecutionRegister(EmitEndDragSequenceEventRequest)], EmitEndDragSequenceEvent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EmitEndDragSequenceEvent, [{
    type: Injectable
  }], null, null);
})();
var EmitStartDragSequenceEventRequest = class {
  static fToken = Symbol("EmitStartDragSequenceEventRequest");
};
var EmitStartDragSequenceEvent = class EmitStartDragSequenceEvent2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  _dragContext = inject(FDraggableDataContext);
  handle(_request) {
    if (this._dragContext.draggableItems.length > 0) {
      this._store.flowHost.classList.add(F_CSS_CLASS.DRAG_AND_DROP.DRAGGING);
      this._mediator.execute(new EmitSelectionChangeEventRequest());
      this._emitDragStarted();
    }
  }
  _emitDragStarted() {
    const event = this._dragContext.draggableItems[0].getEvent();
    this._store.fDraggable?.fDragStarted?.emit(new FDragStartedEvent(event.kind, event.data ? __spreadValues({}, event.data) : void 0, event.fEventType));
  }
  static ɵfac = function EmitStartDragSequenceEvent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || EmitStartDragSequenceEvent2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: EmitStartDragSequenceEvent2,
    factory: EmitStartDragSequenceEvent2.ɵfac
  });
};
EmitStartDragSequenceEvent = __decorate([FExecutionRegister(EmitStartDragSequenceEventRequest)], EmitStartDragSequenceEvent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EmitStartDragSequenceEvent, [{
    type: Injectable
  }], null, null);
})();
var EmitSelectionChangeEventRequest = class {
  static fToken = Symbol("EmitSelectionChangeEventRequest");
};
var FDraggableDataContext = class _FDraggableDataContext {
  selectedItems = [];
  isSelectedChanged = false;
  onPointerDownScale = 1;
  onPointerDownPosition = new Point(0, 0);
  draggableItems = [];
  autoPanFrameId = null;
  lastPointerPosition = null;
  isAutoPanCanvasMoved = false;
  reset() {
    for (const h of this.draggableItems) {
      try {
        h.destroy?.();
      } catch {
        console.error(`Error while destroying drag handler of type ${h["type"]}`);
      }
    }
    this.draggableItems = [];
    this.onPointerDownScale = 1;
    this.onPointerDownPosition = new Point(0, 0);
    this.autoPanFrameId = null;
    this.lastPointerPosition = null;
    this.isAutoPanCanvasMoved = false;
  }
  markSelectionAsChanged() {
    this.isSelectedChanged = true;
  }
  rememberPointerPosition(event) {
    this.lastPointerPosition = event.getPosition();
  }
  isEmpty() {
    return !this.draggableItems.length;
  }
  static ɵfac = function FDraggableDataContext_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FDraggableDataContext)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _FDraggableDataContext,
    factory: _FDraggableDataContext.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FDraggableDataContext, [{
    type: Injectable
  }], null, null);
})();
var FSelectionChangeEvent = class {
  nodeIds;
  groupIds;
  connectionIds;
  /** @deprecated Use `nodeIds` */
  get fNodeIds() {
    return this.nodeIds;
  }
  /** @deprecated Use `groupIds` */
  get fGroupIds() {
    return this.groupIds;
  }
  /** @deprecated Use `connectionIds` */
  get fConnectionIds() {
    return this.connectionIds;
  }
  constructor(nodeIds, groupIds, connectionIds) {
    this.nodeIds = nodeIds;
    this.groupIds = groupIds;
    this.connectionIds = connectionIds;
  }
};
var EmitSelectionChangeEvent = class EmitSelectionChangeEvent2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  _dragSession = inject(FDraggableDataContext);
  handle(_request) {
    if (!this._dragSession.isSelectedChanged) {
      return;
    }
    this._emitSelectionChange(this._getSelection());
    this._dragSession.isSelectedChanged = false;
    this._mediator.execute(new NotifyTransformChangedRequest());
  }
  _getSelection() {
    return this._mediator.execute(new GetCurrentSelectionRequest());
  }
  _emitSelectionChange(selection) {
    this._store.fDraggable?.fSelectionChange.emit(new FSelectionChangeEvent(selection.fNodeIds, selection.fGroupIds, selection.fConnectionIds));
  }
  static ɵfac = function EmitSelectionChangeEvent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || EmitSelectionChangeEvent2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: EmitSelectionChangeEvent2,
    factory: EmitSelectionChangeEvent2.ɵfac
  });
};
EmitSelectionChangeEvent = __decorate([FExecutionRegister(EmitSelectionChangeEventRequest)], EmitSelectionChangeEvent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EmitSelectionChangeEvent, [{
    type: Injectable
  }], null, null);
})();
var GetNormalizedParentNodeRectRequest = class {
  nodeOrGroup;
  static fToken = Symbol("GetNormalizedParentNodeRectRequest");
  constructor(nodeOrGroup) {
    this.nodeOrGroup = nodeOrGroup;
  }
};
var GetNormalizedParentNodeRect = class GetNormalizedParentNodeRect2 {
  _store = inject(FComponentsStore);
  _mediator = inject(FMediator);
  handle({
    nodeOrGroup
  }) {
    let result = RectExtensions.initialize(-Infinity, -Infinity, Infinity, Infinity);
    const parentNode = this._getNode(nodeOrGroup.fParentId());
    if (parentNode) {
      result = this._getParentRect(parentNode);
    }
    return result;
  }
  _getNode(fId) {
    return this._store.nodes.get(fId);
  }
  //   Parent Node
  // +----------------------------------------+
  // |  padding-top                           |
  // |  +----------------------------------+  |
  // |  |                                  |  |
  // |  |   Available area for             |  |
  // |p |   child nodes                    |p |
  // |a |                                  |a |
  // |d |   (width - padLeft - padRight)   |d |
  // |  |                                  |d |
  // |l |   (height - padTop - padBottom)  |i |
  // |e |                                  |n |
  // |f |                                  |g |
  // |t |                                  |  |
  // |  |                                  |r |
  // |  |                                  |i |
  // |  |                                  |g |
  // |  |                                  |h |
  // |  |                                  |t |
  // |  +----------------------------------+  |
  // |  padding-bottom                        |
  // +----------------------------------------+
  _getParentRect(nodeOrGroup) {
    const rect = this._getNodeRect(nodeOrGroup);
    const padding = this._getNodePadding(nodeOrGroup, rect);
    return RectExtensions.initialize(rect.x + padding[0], rect.y + padding[1], rect.width - padding[0] - padding[2], rect.height - padding[1] - padding[3]);
  }
  _getNodeRect(nodeOrGroup) {
    return this._mediator.execute(new GetNormalizedElementRectRequest(nodeOrGroup.hostElement));
  }
  _getNodePadding(nodeOrGroup, rect) {
    return this._mediator.execute(new GetNodePaddingRequest(nodeOrGroup, rect));
  }
  static ɵfac = function GetNormalizedParentNodeRect_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || GetNormalizedParentNodeRect2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: GetNormalizedParentNodeRect2,
    factory: GetNormalizedParentNodeRect2.ɵfac
  });
};
GetNormalizedParentNodeRect = __decorate([FExecutionRegister(GetNormalizedParentNodeRectRequest)], GetNormalizedParentNodeRect);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GetNormalizedParentNodeRect, [{
    type: Injectable
  }], null, null);
})();
var IsArrayHasParentNodeRequest = class {
  fParentNodes;
  fDraggedNodes;
  static fToken = Symbol("IsArrayHasParentNodeRequest");
  constructor(fParentNodes, fDraggedNodes) {
    this.fParentNodes = fParentNodes;
    this.fDraggedNodes = fDraggedNodes;
  }
};
var IsArrayHasParentNode = class IsArrayHasParentNode2 {
  handle(request) {
    return this._isParentNodeInArray(this._getParentNodeIds(request.fParentNodes), request.fDraggedNodes);
  }
  _getParentNodeIds(fParentNodes) {
    return fParentNodes.map((x) => x.fId());
  }
  _isParentNodeInArray(parentNodeIds, fDraggedNodes) {
    return fDraggedNodes.some((x) => parentNodeIds.includes(x.fId()));
  }
  static ɵfac = function IsArrayHasParentNode_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || IsArrayHasParentNode2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: IsArrayHasParentNode2,
    factory: IsArrayHasParentNode2.ɵfac
  });
};
IsArrayHasParentNode = __decorate([FExecutionRegister(IsArrayHasParentNodeRequest)], IsArrayHasParentNode);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(IsArrayHasParentNode, [{
    type: Injectable
  }], null, null);
})();
var FNodeIntersectedWithConnections = class {
  fNodeId;
  fConnectionIds;
  constructor(fNodeId, fConnectionIds) {
    this.fNodeId = fNodeId;
    this.fConnectionIds = fConnectionIds;
  }
};
var FNodeConnectionsIntersectionEvent = class extends FNodeIntersectedWithConnections {
  nodeId;
  connectionIds;
  constructor(nodeId, connectionIds) {
    super(nodeId, connectionIds);
    this.nodeId = nodeId;
    this.connectionIds = connectionIds;
  }
};
var DetectConnectionsUnderDragNodeRequest = class {
  nodeOrGroup;
  static fToken = Symbol("DetectConnectionsUnderDragNodeRequest");
  constructor(nodeOrGroup) {
    this.nodeOrGroup = nodeOrGroup;
  }
};
var DetectConnectionsUnderDragNode = class DetectConnectionsUnderDragNode2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  handle({
    nodeOrGroup
  }) {
    const sourceConnectorIds = this._collectConnectableConnectorIds(nodeOrGroup, "source");
    const targetConnectorIds = this._collectConnectableConnectorIds(nodeOrGroup, "target");
    if (!sourceConnectorIds.size || !targetConnectorIds.size) {
      return;
    }
    const attachedConnectionIds = this._collectAttachedConnectionIds(sourceConnectorIds, targetConnectorIds);
    const underNode = this._collectConnectionsUnderNode(nodeOrGroup);
    const intersectedIds = [];
    for (const c of underNode) {
      const id = c.fId();
      if (!attachedConnectionIds.has(id)) {
        intersectedIds.push(id);
      }
    }
    if (!intersectedIds.length) {
      return;
    }
    this._store.fDraggable?.fNodeIntersectedWithConnections.emit(new FNodeConnectionsIntersectionEvent(nodeOrGroup.fId(), intersectedIds));
    this._store.fDraggable?.fNodeConnectionsIntersection.emit(new FNodeConnectionsIntersectionEvent(nodeOrGroup.fId(), intersectedIds));
  }
  _collectConnectableConnectorIds(node, kind) {
    const list = kind === "source" ? this._store.outputs.getAll() : this._store.inputs.getAll();
    const ids = /* @__PURE__ */ new Set();
    for (const c of list) {
      if (c.canBeConnected && node.isContains(c.hostElement)) {
        ids.add(c.fId());
      }
    }
    return ids;
  }
  _collectAttachedConnectionIds(outputConnectorIds, inputConnectorIds) {
    const ids = /* @__PURE__ */ new Set();
    for (const connection of this._store.connections.getAll()) {
      if (outputConnectorIds.has(connection.fOutputId()) || inputConnectorIds.has(connection.fInputId())) {
        ids.add(connection.fId());
      }
    }
    return ids;
  }
  _collectConnectionsUnderNode(node) {
    const nodeRect = this._mediator.execute(new GetNormalizedConnectorRectRequest(node.hostElement, false));
    const result = [];
    for (const c of this._store.connections.getAll()) {
      if (this._hasIntersection(c, nodeRect)) {
        result.push(c);
      }
    }
    return result;
  }
  _hasIntersection(connection, nodeRect) {
    return GetIntersections.getRoundedRectIntersectionsWithSVGPath(connection.fPath().hostElement, nodeRect).length > 0;
  }
  static ɵfac = function DetectConnectionsUnderDragNode_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || DetectConnectionsUnderDragNode2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: DetectConnectionsUnderDragNode2,
    factory: DetectConnectionsUnderDragNode2.ɵfac
  });
};
DetectConnectionsUnderDragNode = __decorate([FExecutionRegister(DetectConnectionsUnderDragNodeRequest)], DetectConnectionsUnderDragNode);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DetectConnectionsUnderDragNode, [{
    type: Injectable
  }], null, null);
})();
var DRAG_AND_DROP_COMMON_PROVIDERS = [EmitStartDragSequenceEvent, EmitEndDragSequenceEvent, EmitSelectionChangeEvent, GetNormalizedParentNodeRect, IsArrayHasParentNode, DetectConnectionsUnderDragNode];
var REBASE_AUTO_PAN_KINDS = /* @__PURE__ */ new Set(["create-connection", "reassign-connection", "drag-node"]);
var DIRECT_AUTO_PAN_KINDS = /* @__PURE__ */ new Set(["selection-area"]);
var AUXILIARY_AUTO_PAN_KINDS = /* @__PURE__ */ new Set(["assign-to-container"]);
function resolveAutoPanMode(kinds) {
  let result = null;
  for (const kind of kinds) {
    if (AUXILIARY_AUTO_PAN_KINDS.has(kind)) {
      continue;
    }
    const next = REBASE_AUTO_PAN_KINDS.has(kind) ? "rebase" : DIRECT_AUTO_PAN_KINDS.has(kind) ? "direct" : null;
    if (!next) {
      return null;
    }
    if (!result) {
      result = next;
      continue;
    }
    if (result !== next) {
      return null;
    }
  }
  return result;
}
function calculateAutoPanDelta(pointerPosition, hostRect, threshold, speed, acceleration) {
  return PointExtensions.initialize(calculateAutoPanAxisDelta(pointerPosition.x, hostRect.left, hostRect.right, threshold, speed, acceleration), calculateAutoPanAxisDelta(pointerPosition.y, hostRect.top, hostRect.bottom, threshold, speed, acceleration));
}
function calculateAutoPanAxisDelta(pointerCoordinate, min, max, threshold, speed, acceleration) {
  const normalizedThreshold = Math.max(0, threshold);
  const normalizedSpeed = Math.max(0, speed);
  if (!normalizedThreshold || !normalizedSpeed) {
    return 0;
  }
  if (pointerCoordinate <= min + normalizedThreshold) {
    const ratio = clamp$1((min + normalizedThreshold - pointerCoordinate) / normalizedThreshold, 0, 1);
    return resolveAxisSpeed(ratio, normalizedSpeed, acceleration);
  }
  if (pointerCoordinate >= max - normalizedThreshold) {
    const ratio = clamp$1((pointerCoordinate - (max - normalizedThreshold)) / normalizedThreshold, 0, 1);
    return -resolveAxisSpeed(ratio, normalizedSpeed, acceleration);
  }
  return 0;
}
function rebaseAutoPanPointerDownPosition(position, canvasDelta, scale) {
  const normalizedScale = scale || 1;
  return Point.fromPoint(position).add(Point.fromPoint(canvasDelta).div(normalizedScale));
}
function resolveAxisSpeed(ratio, speed, acceleration) {
  return acceleration ? speed * ratio : speed;
}
function clamp$1(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
var RunAutoPanFrameRequest = class {
  static fToken = Symbol("RunAutoPanFrameRequest");
};
var StopAutoPanRequest = class {
  static fToken = Symbol("StopAutoPanRequest");
};
var StopAutoPan = class StopAutoPan2 {
  _store = inject(FComponentsStore);
  _dragContext = inject(FDraggableDataContext);
  handle(_request) {
    if (this._dragContext.autoPanFrameId !== null) {
      cancelAnimationFrame(this._dragContext.autoPanFrameId);
      this._dragContext.autoPanFrameId = null;
    }
    if (!this._dragContext.isAutoPanCanvasMoved) {
      return;
    }
    this._store.fCanvas?.emitCanvasChangeEvent();
    this._dragContext.isAutoPanCanvasMoved = false;
  }
  static ɵfac = function StopAutoPan_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || StopAutoPan2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: StopAutoPan2,
    factory: StopAutoPan2.ɵfac
  });
};
StopAutoPan = __decorate([FExecutionRegister(StopAutoPanRequest)], StopAutoPan);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StopAutoPan, [{
    type: Injectable
  }], null, null);
})();
var ScheduleAutoPanFrameRequest = class {
  static fToken = Symbol("ScheduleAutoPanFrameRequest");
};
var ScheduleAutoPanFrame = class ScheduleAutoPanFrame2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  _dragContext = inject(FDraggableDataContext);
  handle(_request) {
    if (!this._canAutoPan() || !this._hasAutoPanDelta()) {
      this._mediator.execute(new StopAutoPanRequest());
      return;
    }
    if (this._dragContext.autoPanFrameId !== null) {
      return;
    }
    this._dragContext.autoPanFrameId = requestAnimationFrame(() => {
      this._dragContext.autoPanFrameId = null;
      this._mediator.execute(new RunAutoPanFrameRequest());
    });
  }
  _canAutoPan() {
    return !!this._store.fFlow && !!this._store.fCanvas && !!this._store.fDraggable?.isDragStarted && !!this._autoPan() && !!this._getAutoPanMode() && this._edgeThreshold() > 0 && this._speed() > 0;
  }
  _hasAutoPanDelta() {
    const delta = this._getAutoPanDelta();
    return !!delta.x || !!delta.y;
  }
  _getAutoPanDelta() {
    const pointerPosition = this._dragContext.lastPointerPosition;
    const flowHost = this._store.fFlow?.hostElement;
    if (!pointerPosition || !flowHost) {
      return PointExtensions.initialize();
    }
    return calculateAutoPanDelta(pointerPosition, flowHost.getBoundingClientRect(), this._edgeThreshold(), this._speed(), this._acceleration());
  }
  _getAutoPanMode() {
    return resolveAutoPanMode(this._dragContext.draggableItems.map((x) => x.getEvent().kind));
  }
  _edgeThreshold() {
    return Math.max(0, this._autoPan()?.fEdgeThreshold() ?? 0);
  }
  _speed() {
    return Math.max(0, this._autoPan()?.fSpeed() ?? 0);
  }
  _acceleration() {
    return !!this._autoPan()?.fAcceleration();
  }
  _autoPan() {
    return this._store.instances.get(INSTANCES.AUTO_PAN);
  }
  static ɵfac = function ScheduleAutoPanFrame_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ScheduleAutoPanFrame2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ScheduleAutoPanFrame2,
    factory: ScheduleAutoPanFrame2.ɵfac
  });
};
ScheduleAutoPanFrame = __decorate([FExecutionRegister(ScheduleAutoPanFrameRequest)], ScheduleAutoPanFrame);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScheduleAutoPanFrame, [{
    type: Injectable
  }], null, null);
})();
var RunAutoPanFrame = class RunAutoPanFrame2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  _dragContext = inject(FDraggableDataContext);
  handle(_request) {
    const mode = this._getAutoPanMode();
    if (!this._canAutoPan(mode)) {
      this._mediator.execute(new StopAutoPanRequest());
      return;
    }
    const delta = this._getAutoPanDelta();
    if (!delta.x && !delta.y) {
      this._mediator.execute(new StopAutoPanRequest());
      return;
    }
    this._applyCanvasDelta(delta, mode);
    this._replayLastPointerMove();
    this._mediator.execute(new ScheduleAutoPanFrameRequest());
  }
  _applyCanvasDelta(delta, mode) {
    const transform = this._store.transform;
    if (mode === "rebase") {
      this._dragContext.onPointerDownPosition = rebaseAutoPanPointerDownPosition(this._dragContext.onPointerDownPosition, delta, this._dragContext.onPointerDownScale || transform.scale || 1);
    }
    transform.position = Point.fromPoint(transform.position).add(delta);
    this._store.fCanvas?.redraw();
    this._dragContext.isAutoPanCanvasMoved = true;
  }
  _replayLastPointerMove() {
    const pointerPosition = this._dragContext.lastPointerPosition;
    if (!pointerPosition) {
      return;
    }
    const difference = this._getPointerPositionInCanvas(pointerPosition).div(this._dragContext.onPointerDownScale).sub(this._dragContext.onPointerDownPosition);
    this._dragContext.draggableItems.forEach((item) => {
      item.onPointerMove(__spreadValues({}, difference));
    });
  }
  _getPointerPositionInCanvas(pointerPosition) {
    return Point.fromPoint(pointerPosition).elementTransform(this._store.flowHost);
  }
  _canAutoPan(mode) {
    return !!this._store.fFlow && !!this._store.fCanvas && !!this._store.fDraggable?.isDragStarted && !!this._autoPan() && !!mode && this._edgeThreshold() > 0 && this._speed() > 0;
  }
  _getAutoPanMode() {
    return resolveAutoPanMode(this._dragContext.draggableItems.map((x) => x.getEvent().kind));
  }
  _getAutoPanDelta() {
    const pointerPosition = this._dragContext.lastPointerPosition;
    const flowHost = this._store.fFlow?.hostElement;
    if (!pointerPosition || !flowHost) {
      return PointExtensions.initialize();
    }
    return calculateAutoPanDelta(pointerPosition, flowHost.getBoundingClientRect(), this._edgeThreshold(), this._speed(), this._acceleration());
  }
  _edgeThreshold() {
    return Math.max(0, this._autoPan()?.fEdgeThreshold() ?? 0);
  }
  _speed() {
    return Math.max(0, this._autoPan()?.fSpeed() ?? 0);
  }
  _acceleration() {
    return !!this._autoPan()?.fAcceleration();
  }
  _autoPan() {
    return this._store.instances.get(INSTANCES.AUTO_PAN);
  }
  static ɵfac = function RunAutoPanFrame_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RunAutoPanFrame2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RunAutoPanFrame2,
    factory: RunAutoPanFrame2.ɵfac
  });
};
RunAutoPanFrame = __decorate([FExecutionRegister(RunAutoPanFrameRequest)], RunAutoPanFrame);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RunAutoPanFrame, [{
    type: Injectable
  }], null, null);
})();
var DRAG_AUTO_PAN_PROVIDERS = [ScheduleAutoPanFrame, RunAutoPanFrame, StopAutoPan];
var DragCanvasFinalizeRequest = class {
  event;
  static fToken = Symbol("DragCanvasFinalizeRequest");
  constructor(event) {
    this.event = event;
  }
};
var IPointerEvent = class {
  _event;
  _target;
  get originalEvent() {
    return this._event;
  }
  get targetElement() {
    return this._target || this.originalEvent.target;
  }
  get touchEvent() {
    return this._event;
  }
  get touches() {
    return this.touchEvent.touches;
  }
  constructor(_event, _target) {
    this._event = _event;
    this._target = _target;
  }
  setTarget(target) {
    this._target = target;
  }
  preventDefault() {
    this.originalEvent.preventDefault();
  }
  get isEventInLockedContext() {
    return this.targetElement.closest("[fLockedContext]") !== null;
  }
};
var IMouseEvent = class extends IPointerEvent {
  constructor(event, target) {
    super(event, target);
  }
  isMouseLeftButton() {
    return this.originalEvent.button === 0;
  }
  isMouseRightButton() {
    return this.originalEvent.buttons === 2;
  }
  getPosition() {
    return {
      x: this.originalEvent.clientX,
      y: this.originalEvent.clientY
    };
  }
};
var IPointerUpEvent = class extends IPointerEvent {
  constructor(event, target) {
    super(event, target);
  }
  isMouseLeftButton() {
    const evt = this.originalEvent;
    return evt.pointerType === "mouse" && evt.button === 0 || evt.pointerType === "touch";
  }
  isMouseRightButton() {
    const evt = this.originalEvent;
    return evt.pointerType === "mouse" && evt.button === 2 || evt.pointerType === "touch";
  }
  getPosition() {
    const evt = this.originalEvent;
    return {
      x: evt.clientX,
      y: evt.clientY
    };
  }
  getPointerType() {
    return this.originalEvent.pointerType;
  }
  getPointerId() {
    return this.originalEvent.pointerId;
  }
};
var ITouchDownEvent = class extends IPointerEvent {
  constructor(event) {
    super(event);
  }
  isMouseLeftButton() {
    return true;
  }
  isMouseRightButton() {
    return false;
  }
  getPosition() {
    const touches = this.originalEvent.touches;
    return {
      x: touches[0].clientX,
      y: touches[0].clientY
    };
  }
};
var ITouchMoveEvent = class extends IPointerEvent {
  constructor(event, target) {
    super(event, target);
  }
  isMouseLeftButton() {
    return true;
  }
  isMouseRightButton() {
    return false;
  }
  getPosition() {
    const touch = this.originalEvent.targetTouches[0];
    return {
      x: touch.clientX,
      y: touch.clientY
    };
  }
};
var EventExtensions = class _EventExtensions {
  static _isSupported;
  static _isPassiveEventListenerSupported() {
    if (_EventExtensions._isSupported == null && typeof window !== "undefined") {
      try {
        window.addEventListener("test", _EventExtensions.emptyListener, {
          passive: true
        });
        _EventExtensions._isSupported = true;
      } catch {
        _EventExtensions._isSupported = false;
      }
    }
    return _EventExtensions._isSupported;
  }
  static _passiveEventListener(options) {
    return _EventExtensions._isPassiveEventListenerSupported() ? options : !!options.capture;
  }
  static activeListener() {
    return _EventExtensions._passiveEventListener({
      passive: false
    });
  }
  static passiveListener() {
    return _EventExtensions._passiveEventListener({
      passive: true
    });
  }
  static activeCaptureListener() {
    return _EventExtensions._passiveEventListener({
      passive: false,
      capture: true
    });
  }
  static emptyListener() {
    return () => {
    };
  }
};
var MOUSE_EVENT_IGNORE_TIME = 800;
var DragAndDropBase = class {
  _document = inject(DOCUMENT);
  _ngZone = inject(NgZone, {
    optional: true
  });
  _mouseListeners = EventExtensions.emptyListener();
  _touchListeners = EventExtensions.emptyListener();
  _startListeners = EventExtensions.emptyListener();
  isSyntheticEvent(_event) {
    return !!this._lastTouchEventTime && this._lastTouchEventTime + MOUSE_EVENT_IGNORE_TIME > Date.now();
  }
  _lastTouchEventTime = 0;
  isDragStarted = false;
  _dragStartThreshold = 3;
  _dragStartDelay = 0;
  _dragStartTime = 0;
  _dragStartPosition = {
    x: 0,
    y: 0
  };
  _moveHandler = this._checkDragSequenceToStart;
  _pointerDownElement = null;
  /**
   * Handles the mouse down event to initiate the drag sequence.
   * It checks if the event is synthetic or fake, and if the drag is already started.
   * If not, it sets up the drag start sequence by adding necessary event listeners.
   * @param event - The mouse event that triggered the drag.
   */
  _onMouseDown = (event) => {
    const isSyntheticEvent = this.isSyntheticEvent(event);
    const isFakeEvent = isFakeMousedownFromScreenReader(event);
    const mouseEvent = new IMouseEvent(event);
    if (isSyntheticEvent || isFakeEvent || this.disabled || this.isDragStarted) {
      return;
    }
    this._pointerDownElement = mouseEvent.targetElement;
    const result = this.onPointerDown(mouseEvent);
    if (result) {
      this._dragStartTime = Date.now();
      this._dragStartPosition = mouseEvent.getPosition();
      this._ngZone?.runOutsideAngular(() => {
        this._listen("selectstart", this._onSelectStart, EventExtensions.activeListener());
        this._listen("mousemove", this._onMouseMove);
        this._listen("pointerup", this._onPointerUpEvent);
        this._listen("pointercancel", this._onPointerUpEvent, EventExtensions.activeCaptureListener());
        this._listen("contextmenu", this._preventDuringDrag, EventExtensions.activeCaptureListener());
      });
      this._mouseListeners = () => {
        this._unlisten("selectstart", this._onSelectStart, EventExtensions.activeListener());
        this._unlisten("mousemove", this._onMouseMove);
        this._unlisten("pointerup", this._onPointerUpEvent);
        this._unlisten("pointercancel", this._onPointerUpEvent, EventExtensions.activeCaptureListener());
        this._unlisten("contextmenu", this._preventDuringDrag, EventExtensions.activeCaptureListener());
      };
    }
  };
  /**
   * Handles the touch down event to initiate the drag sequence.
   * It checks if the event is synthetic or fake, and if the drag is already started.
   * If not, it sets up the drag start sequence by adding necessary event listeners.
   * @param event - The touch event that triggered the drag.
   */
  _onTouchDown = (event) => {
    const isFakeEvent = isFakeTouchstartFromScreenReader(event);
    const touchEvent = new ITouchDownEvent(event);
    if (isFakeEvent || this.disabled || this.isDragStarted) {
      return;
    }
    this._pointerDownElement = touchEvent.targetElement;
    const result = this.onPointerDown(touchEvent);
    if (result) {
      this._dragStartTime = Date.now();
      this._dragStartPosition = touchEvent.getPosition();
      this._ngZone?.runOutsideAngular(() => {
        this._listen("selectstart", this._onSelectStart, EventExtensions.activeListener());
        this._listen("touchmove", this._onTouchMove);
        this._listen("pointerup", this._onPointerUpEvent);
        this._listen("pointercancel", this._onPointerUpEvent, EventExtensions.activeCaptureListener());
        this._listen("contextmenu", this._preventDuringDrag, EventExtensions.activeCaptureListener());
      });
      this._touchListeners = () => {
        this._unlisten("selectstart", this._onSelectStart, EventExtensions.activeListener());
        this._unlisten("touchmove", this._onTouchMove);
        this._unlisten("pointerup", this._onPointerUpEvent);
        this._unlisten("pointercancel", this._onPointerUpEvent, EventExtensions.activeCaptureListener());
        this._unlisten("contextmenu", this._preventDuringDrag, EventExtensions.activeCaptureListener());
      };
    }
  };
  /**
   * Handles the select start event.
   * This method is called when the user starts selecting text or elements.
   * It prevents the default behavior and calls the onSelect method to handle the selection.
   * @param event - The event that triggered the select start.
   */
  _onSelectStart = (event) => {
    this.onSelect(event);
  };
  /**
   * Handles the mouse move event during the drag sequence.
   * It checks if the drag sequence should start and calls the move handler accordingly.
   * @param event - The mouse event that triggered the move.
   */
  _onMouseMove = (event) => {
    this._moveHandler(new IMouseEvent(event));
  };
  /**
   * Handles the touch move event during the drag sequence.
   * It checks if the drag sequence should start and calls the move handler accordingly.
   * @param event - The touch event that triggered the move.
   */
  _onTouchMove = (event) => {
    this._moveHandler(new ITouchMoveEvent(event));
  };
  /**
   * Checks if the drag sequence should start based on the pointer position.
   * It compares the current pointer position with the initial drag start position
   * and checks if the distance exceeds the drag start threshold.
   * If the threshold is exceeded and the delay has passed,
   * it prepares the drag sequence and sets the move handler to onPointerMove.
   * @param event - The pointer event that triggered the check.
   */
  _checkDragSequenceToStart(event) {
    const pointerPosition = event.getPosition();
    if (!this.isDragStarted && this._pointerDownElement) {
      event.setTarget(this._pointerDownElement);
      const distanceX = Math.abs(pointerPosition.x - this._dragStartPosition.x);
      const distanceY = Math.abs(pointerPosition.y - this._dragStartPosition.y);
      const isOverThreshold = distanceX + distanceY >= this._dragStartThreshold;
      if (isOverThreshold) {
        const isDelayElapsed = Date.now() >= this._dragStartTime + this._dragStartDelay;
        if (!isDelayElapsed) {
          this._endDragSequence();
          return;
        }
        event.preventDefault();
        this.prepareDragSequence(event);
        this.isDragStarted = true;
        this._moveHandler = this.onPointerMove;
        if (isTouchEvent(event.originalEvent)) {
          this._lastTouchEventTime = Date.now();
        }
      }
    }
  }
  /**
   * Handles the pointer up event at the end of the drag sequence.
   * It checks if the drag has started and calls the onPointerUp method.
   * It also ends the drag sequence by resetting the state and removing event listeners.
   * This method is called when the user releases the mouse button or lifts their finger from the touch screen.
   * @param event - The pointer event that triggered the up action.
   */
  _onPointerUpEvent = (event) => {
    if (this.isDragStarted) {
      this.onPointerUp(new IPointerUpEvent(event));
    }
    this._endDragSequence();
  };
  /**
   * Ends the drag sequence by resetting the state and removing event listeners.
   * It sets the isDragStarted flag to false, clears the pointerDownElement,
   * and resets the moveHandler to checkDragSequenceToStart.
   * It also removes all mouse and touch event listeners that were added during the drag sequence.
   */
  _endDragSequence() {
    this.isDragStarted = false;
    this._pointerDownElement = null;
    this._moveHandler = this._checkDragSequenceToStart;
    this._mouseListeners();
    this._mouseListeners = EventExtensions.emptyListener();
    this._touchListeners();
    this._touchListeners = EventExtensions.emptyListener();
    this.finalizeDragSequence();
  }
  subscribe() {
    this.unsubscribe();
    this._ngZone?.runOutsideAngular(() => {
      this._listen("mousedown", this._onMouseDown, EventExtensions.activeListener());
      this._listen("touchstart", this._onTouchDown, EventExtensions.passiveListener());
    });
    this._startListeners = () => {
      this._unlisten("mousedown", this._onMouseDown, EventExtensions.activeListener());
      this._unlisten("touchstart", this._onTouchDown, EventExtensions.passiveListener());
    };
  }
  unsubscribe() {
    this._startListeners();
    this._startListeners = EventExtensions.emptyListener();
    this._touchListeners();
    this._touchListeners = EventExtensions.emptyListener();
    this._mouseListeners();
    this._mouseListeners = EventExtensions.emptyListener();
  }
  _listen(type, listener, options) {
    this._document.addEventListener(type, listener, options);
  }
  _unlisten(type, listener, options) {
    this._document.removeEventListener(type, listener, options);
  }
  _preventDuringDrag = (e) => {
    if (this.isDragStarted) {
      e.preventDefault();
    }
  };
};
function isTouchEvent(event) {
  return event.type[0] === "t";
}
function isFakeMousedownFromScreenReader(event) {
  return event.buttons === 0 || event.offsetX === 0 && event.offsetY === 0;
}
function isFakeTouchstartFromScreenReader(event) {
  const touch = event.touches && event.touches[0] || event.changedTouches && event.changedTouches[0];
  return !!touch && touch.identifier === -1 && (touch.radiusX == null || touch.radiusX === 1) && (touch.radiusY == null || touch.radiusY === 1);
}
var FDragStartedEvent = class {
  /** New identifier (can differ from legacy). */
  kind;
  /** Payload. */
  data;
  /**
   * Legacy identifier.
   * Kept as own property to preserve Object.keys / hasOwnProperty / spread behavior.
   * @deprecated Use `kind`
   */
  fEventType;
  /** @deprecated Use `data` */
  get fData() {
    return this.data;
  }
  constructor(kind, data, legacyKind) {
    this.kind = kind;
    this.data = data;
    this.fEventType = legacyKind ?? kind;
  }
};
var DragHandlerBase = class {
  data() {
    return void 0;
  }
  _features = [];
  getEvent() {
    return new FDragStartedEvent(this.kind, this.data(), this.type);
  }
  attachFeature(feature) {
    this._features.push(feature);
  }
  featuresPrepare(ctx) {
    for (const feature of this._features) {
      feature.onPrepare?.(ctx);
    }
  }
  featuresMove(ctx, delta) {
    for (const feature of this._features) {
      feature.onMove?.(ctx, delta);
    }
  }
  featuresFinalize(ctx, delta) {
    for (const feature of this._features) {
      feature.onFinalize?.(ctx, delta);
    }
  }
  featuresEnd(ctx) {
    for (const feature of this._features) {
      feature.onEnd?.(ctx);
    }
  }
};
var FConnectorBase = class {
  _isConnected = false;
  get isConnected() {
    return this._isConnected;
  }
  toConnector = [];
  isSelfConnectable = true;
  fConnectableSide = EFConnectableSide.AUTO;
  userFConnectableSide = EFConnectableSide.AUTO;
  isContains(element) {
    return this.hostElement.contains(element);
  }
  setConnected(toConnector) {
    this._isConnected = true;
    this.toConnector.push(toConnector);
  }
  resetConnected() {
    this._isConnected = false;
    this.toConnector = [];
  }
};
var F_NODE_INPUT = new InjectionToken("F_NODE_INPUT");
var FNodeInputBase = class _FNodeInputBase extends FConnectorBase {
  kind = "input";
  get canBeConnected() {
    return !this.disabled() && (this.multiple() ? true : !this.isConnected);
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFNodeInputBase_BaseFactory;
    return function FNodeInputBase_Factory(__ngFactoryType__) {
      return (ɵFNodeInputBase_BaseFactory || (ɵFNodeInputBase_BaseFactory = ɵɵgetInheritedFactory(_FNodeInputBase)))(__ngFactoryType__ || _FNodeInputBase);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _FNodeInputBase,
    features: [ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FNodeInputBase, [{
    type: Directive
  }], null, null);
})();
var EFResizeHandleType;
(function(EFResizeHandleType2) {
  EFResizeHandleType2["LEFT"] = "left";
  EFResizeHandleType2["LEFT_TOP"] = "left-top";
  EFResizeHandleType2["TOP"] = "top";
  EFResizeHandleType2["RIGHT_TOP"] = "right-top";
  EFResizeHandleType2["RIGHT"] = "right";
  EFResizeHandleType2["RIGHT_BOTTOM"] = "right-bottom";
  EFResizeHandleType2["BOTTOM"] = "bottom";
  EFResizeHandleType2["LEFT_BOTTOM"] = "left-bottom";
})(EFResizeHandleType || (EFResizeHandleType = {}));
var FResizeHandleDirective = class _FResizeHandleDirective {
  type = input.required(...ngDevMode ? [{
    debugName: "type",
    alias: "fResizeHandleType",
    transform: (x) => castToEnum(x, "fResizeHandleType", EFResizeHandleType)
  }] : [{
    alias: "fResizeHandleType",
    transform: (x) => castToEnum(x, "fResizeHandleType", EFResizeHandleType)
  }]);
  class = computed(() => {
    return `f-resize-handle-${EFResizeHandleType[this.type().toUpperCase()]}`;
  }, ...ngDevMode ? [{
    debugName: "class"
  }] : []);
  static ɵfac = function FResizeHandleDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FResizeHandleDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FResizeHandleDirective,
    selectors: [["", "fResizeHandle", ""]],
    hostAttrs: [1, "f-resize-handle", "f-component"],
    hostVars: 3,
    hostBindings: function FResizeHandleDirective_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("data-f-resize-handle-type", ctx.type().toUpperCase());
        ɵɵclassMap(ctx.class());
      }
    },
    inputs: {
      type: [1, "fResizeHandleType", "type"]
    },
    standalone: false
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FResizeHandleDirective, [{
    type: Directive,
    args: [{
      standalone: false,
      selector: "[fResizeHandle]",
      host: {
        class: `f-resize-handle f-component`,
        "[attr.data-f-resize-handle-type]": "type().toUpperCase()",
        "[class]": "class()"
      }
    }]
  }], null, {
    type: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fResizeHandleType",
        required: true
      }]
    }]
  });
})();
var FRotateHandleDirective = class _FRotateHandleDirective {
  static ɵfac = function FRotateHandleDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FRotateHandleDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FRotateHandleDirective,
    selectors: [["", "fRotateHandle", ""]],
    hostAttrs: [1, "f-rotate-handle", "f-component"],
    standalone: false
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FRotateHandleDirective, [{
    type: Directive,
    args: [{
      standalone: false,
      selector: "[fRotateHandle]",
      host: {
        class: `f-rotate-handle f-component`
      }
    }]
  }], null, null);
})();
function isRotateHandle(element) {
  return isClosestElementHasClass(element, ".f-rotate-handle");
}
var FDragHandleDirective = class _FDragHandleDirective {
  static ɵfac = function FDragHandleDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FDragHandleDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FDragHandleDirective,
    selectors: [["", "fDragHandle", ""]],
    hostAttrs: [1, "f-drag-handle", "f-component"],
    standalone: false
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FDragHandleDirective, [{
    type: Directive,
    args: [{
      standalone: false,
      selector: "[fDragHandle]",
      host: {
        class: "f-drag-handle f-component"
      }
    }]
  }], null, null);
})();
var F_NODE = new InjectionToken("F_NODE");
var MIXIN_BASE = mixinChangeSelection(class {
  hostElement;
  constructor(hostElement) {
    this.hostElement = hostElement;
  }
});
var FNodeBase = class extends MIXIN_BASE {
  _injector = inject(Injector);
  renderer = inject(Renderer2);
  browser = inject(BrowserService);
  stateChanges = new FChannel();
  _position = PointExtensions.initialize();
  _rotate = 0;
  _size;
  connectors = [];
  positionChanges() {
    effect(() => {
      const position = this.position();
      untracked(() => {
        if (!PointExtensions.isEqual(this._position, position)) {
          this._position = position;
          this.redraw();
          this.refresh();
        }
      });
    }, {
      injector: this._injector
    });
  }
  sizeChanges() {
    effect(() => {
      const size = this.size();
      untracked(() => {
        if (!this._isSizeEqual(size)) {
          this._size = size;
          this.redraw();
          this.refresh();
        }
      });
    }, {
      injector: this._injector
    });
  }
  rotateChanges() {
    effect(() => {
      const rotate = this.rotate();
      untracked(() => {
        if (this._rotate !== rotate) {
          this._rotate = rotate;
          this.redraw();
          this.refresh();
        }
      });
    }, {
      injector: this._injector
    });
  }
  parentChanges() {
    effect(() => {
      this.fParentId();
      this.fIncludePadding();
      this.fAutoSizeToFitChildren();
      untracked(() => this.refresh());
    }, {
      injector: this._injector
    });
  }
  _isSizeEqual(value) {
    return this._size?.width === value?.width && this._size?.height === value?.height;
  }
  isContains(element) {
    return this.hostElement.contains(element);
  }
  redraw() {
    if (this._size) {
      this.setStyle("width", "" + this._size.width + "px");
      this.setStyle("height", "" + this._size.height + "px");
    }
    this.setStyle("transform", `translate(${this._position.x}px,${this._position.y}px) rotate(${this._rotate}deg)`);
  }
  resetSize() {
    this.removeStyle("width");
    this.removeStyle("height");
  }
  updatePosition(position) {
    this._position = position;
  }
  updateRotate(rotate) {
    this._rotate = rotate;
  }
  updateSize(value) {
    this._size = value;
  }
  setClass(className) {
    this.hostElement.classList.add(className);
  }
  removeClass(className) {
    this.hostElement.classList.remove(className);
  }
  addConnector(connector) {
    this.connectors.push(connector);
    this.refresh();
  }
  removeConnector(connector) {
    const index = this.connectors.indexOf(connector);
    if (index !== -1) {
      this.connectors.splice(index, 1);
    }
    this.refresh();
  }
};
var uniqueId$b = 0;
var _DEBOUNCE_TIME$1 = 3;
var FGroupDirective = class _FGroupDirective extends FNodeBase {
  _debounceTimer = null;
  _destroyRef = inject(DestroyRef);
  _mediator = inject(FMediator);
  fId = input(`f-group-${uniqueId$b++}`, ...ngDevMode ? [{
    debugName: "fId",
    alias: "fGroupId"
  }] : [{
    alias: "fGroupId"
  }]);
  fParentId = input(null, ...ngDevMode ? [{
    debugName: "fParentId",
    alias: "fGroupParentId"
  }] : [{
    alias: "fGroupParentId"
  }]);
  position = model(PointExtensions.initialize(), ...ngDevMode ? [{
    debugName: "position",
    alias: "fGroupPosition"
  }] : [{
    alias: "fGroupPosition"
  }]);
  size = input(void 0, ...ngDevMode ? [{
    debugName: "size",
    alias: "fGroupSize"
  }] : [{
    alias: "fGroupSize"
  }]);
  sizeChange = output({
    alias: "fGroupSizeChange"
  });
  rotate = model(0, ...ngDevMode ? [{
    debugName: "rotate",
    alias: "fGroupRotate"
  }] : [{
    alias: "fGroupRotate"
  }]);
  fConnectOnNode = input(true, ...ngDevMode ? [{
    debugName: "fConnectOnNode",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]);
  fMinimapClass = input([], ...ngDevMode ? [{
    debugName: "fMinimapClass"
  }] : []);
  fDraggingDisabled = input(false, ...ngDevMode ? [{
    debugName: "fDraggingDisabled",
    alias: "fGroupDraggingDisabled",
    transform: booleanAttribute
  }] : [{
    alias: "fGroupDraggingDisabled",
    transform: booleanAttribute
  }]);
  fSelectionDisabled = input(false, ...ngDevMode ? [{
    debugName: "fSelectionDisabled",
    alias: "fGroupSelectionDisabled",
    transform: booleanAttribute
  }] : [{
    alias: "fGroupSelectionDisabled",
    transform: booleanAttribute
  }]);
  fIncludePadding = input(true, ...ngDevMode ? [{
    debugName: "fIncludePadding",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]);
  fAutoExpandOnChildHit = input(false, ...ngDevMode ? [{
    debugName: "fAutoExpandOnChildHit",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]);
  fAutoSizeToFitChildren = input(false, ...ngDevMode ? [{
    debugName: "fAutoSizeToFitChildren",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]);
  constructor(elementReference) {
    super(elementReference.nativeElement);
    super.positionChanges();
    super.sizeChanges();
    super.rotateChanges();
    super.parentChanges();
  }
  ngOnInit() {
    super.redraw();
    this._mediator.execute(new AddNodeToStoreRequest(this));
  }
  setStyle(styleName, value) {
    this.renderer.setStyle(this.hostElement, styleName, value);
  }
  removeStyle(styleName) {
    this.renderer.removeStyle(this.hostElement, styleName);
  }
  redraw() {
    super.redraw();
    this._mediator.execute(new NotifyTransformChangedRequest());
    this._updateConnectorsSides();
  }
  _updateConnectorsSides() {
    if (!this.connectors.length) {
      return;
    }
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }
    this._debounceTimer = setTimeout(() => this._calculateNodeConnectorsConnectableSides(), _DEBOUNCE_TIME$1);
  }
  _calculateNodeConnectorsConnectableSides() {
    this._mediator.execute(new CalculateConnectorsConnectableSidesRequest(this));
  }
  ngAfterViewInit() {
    if (!this.browser.isBrowser()) {
      return;
    }
    this._listenStateSizeChanges();
  }
  _listenStateSizeChanges() {
    this._mediator.execute(new UpdateNodeWhenStateOrSizeChangedRequest(this, this._destroyRef));
  }
  refresh() {
    this.stateChanges.notify();
  }
  ngOnDestroy() {
    this._mediator.execute(new RemoveNodeFromStoreRequest(this));
  }
  static ɵfac = function FGroupDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FGroupDirective)(ɵɵdirectiveInject(ElementRef));
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FGroupDirective,
    selectors: [["", "fGroup", ""]],
    hostAttrs: [1, "f-group", "f-component"],
    hostVars: 6,
    hostBindings: function FGroupDirective_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("data-f-group-id", ctx.fId())("data-f-group-parent-id", ctx.fParentId());
        ɵɵclassProp("f-group-dragging-disabled", ctx.fDraggingDisabled())("f-group-selection-disabled", ctx.fSelectionDisabled());
      }
    },
    inputs: {
      fId: [1, "fGroupId", "fId"],
      fParentId: [1, "fGroupParentId", "fParentId"],
      position: [1, "fGroupPosition", "position"],
      size: [1, "fGroupSize", "size"],
      rotate: [1, "fGroupRotate", "rotate"],
      fConnectOnNode: [1, "fConnectOnNode"],
      fMinimapClass: [1, "fMinimapClass"],
      fDraggingDisabled: [1, "fGroupDraggingDisabled", "fDraggingDisabled"],
      fSelectionDisabled: [1, "fGroupSelectionDisabled", "fSelectionDisabled"],
      fIncludePadding: [1, "fIncludePadding"],
      fAutoExpandOnChildHit: [1, "fAutoExpandOnChildHit"],
      fAutoSizeToFitChildren: [1, "fAutoSizeToFitChildren"]
    },
    outputs: {
      position: "fGroupPositionChange",
      sizeChange: "fGroupSizeChange",
      rotate: "fGroupRotateChange"
    },
    exportAs: ["fComponent"],
    standalone: false,
    features: [ɵɵProvidersFeature([{
      provide: F_NODE,
      useExisting: _FGroupDirective
    }]), ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FGroupDirective, [{
    type: Directive,
    args: [{
      standalone: false,
      selector: "[fGroup]",
      exportAs: "fComponent",
      host: {
        "[attr.data-f-group-id]": "fId()",
        "[attr.data-f-group-parent-id]": "fParentId()",
        class: "f-group f-component",
        "[class.f-group-dragging-disabled]": "fDraggingDisabled()",
        "[class.f-group-selection-disabled]": "fSelectionDisabled()"
      },
      providers: [{
        provide: F_NODE,
        useExisting: FGroupDirective
      }]
    }]
  }], () => [{
    type: ElementRef
  }], {
    fId: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fGroupId",
        required: false
      }]
    }],
    fParentId: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fGroupParentId",
        required: false
      }]
    }],
    position: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fGroupPosition",
        required: false
      }]
    }, {
      type: Output,
      args: ["fGroupPositionChange"]
    }],
    size: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fGroupSize",
        required: false
      }]
    }],
    sizeChange: [{
      type: Output,
      args: ["fGroupSizeChange"]
    }],
    rotate: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fGroupRotate",
        required: false
      }]
    }, {
      type: Output,
      args: ["fGroupRotateChange"]
    }],
    fConnectOnNode: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fConnectOnNode",
        required: false
      }]
    }],
    fMinimapClass: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fMinimapClass",
        required: false
      }]
    }],
    fDraggingDisabled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fGroupDraggingDisabled",
        required: false
      }]
    }],
    fSelectionDisabled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fGroupSelectionDisabled",
        required: false
      }]
    }],
    fIncludePadding: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fIncludePadding",
        required: false
      }]
    }],
    fAutoExpandOnChildHit: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fAutoExpandOnChildHit",
        required: false
      }]
    }],
    fAutoSizeToFitChildren: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fAutoSizeToFitChildren",
        required: false
      }]
    }]
  });
})();
var uniqueId$a = 0;
var _DEBOUNCE_TIME = 3;
var FNodeDirective = class _FNodeDirective extends FNodeBase {
  _debounceTimer = null;
  _destroyRef = inject(DestroyRef);
  _mediator = inject(FMediator);
  fId = input(`f-node-${uniqueId$a++}`, ...ngDevMode ? [{
    debugName: "fId",
    alias: "fNodeId",
    transform: (value) => stringAttribute(value) || `f-node-${uniqueId$a++}`
  }] : [{
    alias: "fNodeId",
    transform: (value) => stringAttribute(value) || `f-node-${uniqueId$a++}`
  }]);
  fParentId = input(null, ...ngDevMode ? [{
    debugName: "fParentId",
    alias: "fNodeParentId"
  }] : [{
    alias: "fNodeParentId"
  }]);
  position = model(PointExtensions.initialize(), ...ngDevMode ? [{
    debugName: "position",
    alias: "fNodePosition"
  }] : [{
    alias: "fNodePosition"
  }]);
  size = input(void 0, ...ngDevMode ? [{
    debugName: "size",
    alias: "fNodeSize"
  }] : [{
    alias: "fNodeSize"
  }]);
  sizeChange = output({
    alias: "fNodeSizeChange"
  });
  rotate = model(0, ...ngDevMode ? [{
    debugName: "rotate",
    alias: "fNodeRotate"
  }] : [{
    alias: "fNodeRotate"
  }]);
  fConnectOnNode = input(true, ...ngDevMode ? [{
    debugName: "fConnectOnNode",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]);
  fMinimapClass = input([], ...ngDevMode ? [{
    debugName: "fMinimapClass"
  }] : []);
  fDraggingDisabled = input(false, ...ngDevMode ? [{
    debugName: "fDraggingDisabled",
    alias: "fNodeDraggingDisabled",
    transform: booleanAttribute
  }] : [{
    alias: "fNodeDraggingDisabled",
    transform: booleanAttribute
  }]);
  fSelectionDisabled = input(false, ...ngDevMode ? [{
    debugName: "fSelectionDisabled",
    alias: "fNodeSelectionDisabled",
    transform: booleanAttribute
  }] : [{
    alias: "fNodeSelectionDisabled",
    transform: booleanAttribute
  }]);
  fIncludePadding = input(true, ...ngDevMode ? [{
    debugName: "fIncludePadding",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]);
  fAutoExpandOnChildHit = input(false, ...ngDevMode ? [{
    debugName: "fAutoExpandOnChildHit",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]);
  fAutoSizeToFitChildren = input(false, ...ngDevMode ? [{
    debugName: "fAutoSizeToFitChildren",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]);
  constructor(elementReference) {
    super(elementReference.nativeElement);
    super.positionChanges();
    super.sizeChanges();
    super.rotateChanges();
    super.parentChanges();
  }
  ngOnInit() {
    super.redraw();
    this._mediator.execute(new AddNodeToStoreRequest(this));
  }
  setStyle(styleName, value) {
    this.renderer.setStyle(this.hostElement, styleName, value);
  }
  removeStyle(styleName) {
    this.renderer.removeStyle(this.hostElement, styleName);
  }
  redraw() {
    super.redraw();
    this._mediator.execute(new NotifyTransformChangedRequest());
    this._updateConnectorsSides();
  }
  _updateConnectorsSides() {
    if (!this.connectors.length) {
      return;
    }
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }
    this._debounceTimer = setTimeout(() => this._calculateNodeConnectorsConnectableSides(), _DEBOUNCE_TIME);
  }
  _calculateNodeConnectorsConnectableSides() {
    this._mediator.execute(new CalculateConnectorsConnectableSidesRequest(this));
  }
  ngAfterViewInit() {
    if (!this.browser.isBrowser()) {
      return;
    }
    this._listenStateSizeChanges();
  }
  _listenStateSizeChanges() {
    this._mediator.execute(new UpdateNodeWhenStateOrSizeChangedRequest(this, this._destroyRef));
  }
  refresh() {
    this.stateChanges.notify();
  }
  ngOnDestroy() {
    this._mediator.execute(new RemoveNodeFromStoreRequest(this));
  }
  static ɵfac = function FNodeDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FNodeDirective)(ɵɵdirectiveInject(ElementRef));
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FNodeDirective,
    selectors: [["", "fNode", ""]],
    hostAttrs: [1, "f-node", "f-component"],
    hostVars: 6,
    hostBindings: function FNodeDirective_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("data-f-node-id", ctx.fId())("data-f-node-parent-id", ctx.fParentId());
        ɵɵclassProp("f-node-dragging-disabled", ctx.fDraggingDisabled())("f-node-selection-disabled", ctx.fSelectionDisabled());
      }
    },
    inputs: {
      fId: [1, "fNodeId", "fId"],
      fParentId: [1, "fNodeParentId", "fParentId"],
      position: [1, "fNodePosition", "position"],
      size: [1, "fNodeSize", "size"],
      rotate: [1, "fNodeRotate", "rotate"],
      fConnectOnNode: [1, "fConnectOnNode"],
      fMinimapClass: [1, "fMinimapClass"],
      fDraggingDisabled: [1, "fNodeDraggingDisabled", "fDraggingDisabled"],
      fSelectionDisabled: [1, "fNodeSelectionDisabled", "fSelectionDisabled"],
      fIncludePadding: [1, "fIncludePadding"],
      fAutoExpandOnChildHit: [1, "fAutoExpandOnChildHit"],
      fAutoSizeToFitChildren: [1, "fAutoSizeToFitChildren"]
    },
    outputs: {
      position: "fNodePositionChange",
      sizeChange: "fNodeSizeChange",
      rotate: "fNodeRotateChange"
    },
    exportAs: ["fComponent"],
    standalone: false,
    features: [ɵɵProvidersFeature([{
      provide: F_NODE,
      useExisting: _FNodeDirective
    }]), ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FNodeDirective, [{
    type: Directive,
    args: [{
      standalone: false,
      selector: "[fNode]",
      exportAs: "fComponent",
      host: {
        "[attr.data-f-node-id]": "fId()",
        "[attr.data-f-node-parent-id]": "fParentId()",
        class: "f-node f-component",
        "[class.f-node-dragging-disabled]": "fDraggingDisabled()",
        "[class.f-node-selection-disabled]": "fSelectionDisabled()"
      },
      providers: [{
        provide: F_NODE,
        useExisting: FNodeDirective
      }]
    }]
  }], () => [{
    type: ElementRef
  }], {
    fId: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fNodeId",
        required: false
      }]
    }],
    fParentId: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fNodeParentId",
        required: false
      }]
    }],
    position: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fNodePosition",
        required: false
      }]
    }, {
      type: Output,
      args: ["fNodePositionChange"]
    }],
    size: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fNodeSize",
        required: false
      }]
    }],
    sizeChange: [{
      type: Output,
      args: ["fNodeSizeChange"]
    }],
    rotate: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fNodeRotate",
        required: false
      }]
    }, {
      type: Output,
      args: ["fNodeRotateChange"]
    }],
    fConnectOnNode: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fConnectOnNode",
        required: false
      }]
    }],
    fMinimapClass: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fMinimapClass",
        required: false
      }]
    }],
    fDraggingDisabled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fNodeDraggingDisabled",
        required: false
      }]
    }],
    fSelectionDisabled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fNodeSelectionDisabled",
        required: false
      }]
    }],
    fIncludePadding: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fIncludePadding",
        required: false
      }]
    }],
    fAutoExpandOnChildHit: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fAutoExpandOnChildHit",
        required: false
      }]
    }],
    fAutoSizeToFitChildren: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fAutoSizeToFitChildren",
        required: false
      }]
    }]
  });
})();
function isNode(element) {
  return !!element.closest("[fNode]");
}
var F_NODE_PROVIDERS = [FGroupDirective, FNodeDirective, FDragHandleDirective, FResizeHandleDirective, FRotateHandleDirective];
var uniqueId$9 = 0;
var FNodeInputDirective = class _FNodeInputDirective extends FNodeInputBase {
  hostElement = inject(ElementRef).nativeElement;
  _mediator = inject(FMediator);
  _node = inject(F_NODE);
  fId = input(`f-node-input-${uniqueId$9++}`, ...ngDevMode ? [{
    debugName: "fId",
    alias: "fInputId",
    transform: (value) => stringAttribute(value) || `f-node-input-${uniqueId$9++}`
  }] : [{
    alias: "fInputId",
    transform: (value) => stringAttribute(value) || `f-node-input-${uniqueId$9++}`
  }]);
  category = input(void 0, ...ngDevMode ? [{
    debugName: "category",
    alias: "fInputCategory",
    transform: stringAttribute
  }] : [{
    alias: "fInputCategory",
    transform: stringAttribute
  }]);
  multiple = input(true, ...ngDevMode ? [{
    debugName: "multiple",
    alias: "fInputMultiple",
    transform: booleanAttribute
  }] : [{
    alias: "fInputMultiple",
    transform: booleanAttribute
  }]);
  disabled = input(false, ...ngDevMode ? [{
    debugName: "disabled",
    alias: "fInputDisabled",
    transform: booleanAttribute
  }] : [{
    alias: "fInputDisabled",
    transform: booleanAttribute
  }]);
  userFConnectableSide = EFConnectableSide.AUTO;
  get fNodeId() {
    return this._node.fId();
  }
  get fNodeHost() {
    return this._node.hostElement;
  }
  ngOnInit() {
    this._mediator.execute(new AddConnectorToStoreRequest(this));
    this._node.addConnector(this);
  }
  ngOnChanges(changes) {
    if (changes["userFConnectableSide"]) {
      this._node.refresh();
    }
  }
  setConnected(toConnector) {
    super.setConnected(toConnector);
    this.hostElement.classList.toggle(F_CSS_CLASS.CONNECTOR.INPUT_CONNECTED, true);
    this.hostElement.classList.toggle(F_CSS_CLASS.CONNECTOR.INPUT_NOT_CONNECTABLE, !this.canBeConnected);
  }
  resetConnected() {
    super.resetConnected();
    this.hostElement.classList.toggle(F_CSS_CLASS.CONNECTOR.INPUT_CONNECTED, false);
    this.hostElement.classList.toggle(F_CSS_CLASS.CONNECTOR.INPUT_NOT_CONNECTABLE, !this.canBeConnected);
  }
  ngOnDestroy() {
    this._node.removeConnector(this);
    this._mediator.execute(new RemoveConnectorFromStoreRequest(this));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFNodeInputDirective_BaseFactory;
    return function FNodeInputDirective_Factory(__ngFactoryType__) {
      return (ɵFNodeInputDirective_BaseFactory || (ɵFNodeInputDirective_BaseFactory = ɵɵgetInheritedFactory(_FNodeInputDirective)))(__ngFactoryType__ || _FNodeInputDirective);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _FNodeInputDirective,
    selectors: [["", "fNodeInput", ""]],
    hostAttrs: [1, "f-component", "f-node-input"],
    hostVars: 5,
    hostBindings: function FNodeInputDirective_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("data-f-input-id", ctx.fId());
        ɵɵclassProp("f-node-input-multiple", ctx.multiple)("f-node-input-disabled", ctx.disabled());
      }
    },
    inputs: {
      fId: [1, "fInputId", "fId"],
      category: [1, "fInputCategory", "category"],
      multiple: [1, "fInputMultiple", "multiple"],
      disabled: [1, "fInputDisabled", "disabled"],
      userFConnectableSide: [2, "fInputConnectableSide", "userFConnectableSide", (value) => castToEnum(value, "fInputConnectableSide", EFConnectableSide)]
    },
    exportAs: ["fNodeInput"],
    standalone: false,
    features: [ɵɵProvidersFeature([{
      provide: F_NODE_INPUT,
      useExisting: _FNodeInputDirective
    }]), ɵɵInheritDefinitionFeature, ɵɵNgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FNodeInputDirective, [{
    type: Directive,
    args: [{
      standalone: false,
      selector: "[fNodeInput]",
      exportAs: "fNodeInput",
      host: {
        "[attr.data-f-input-id]": "fId()",
        class: "f-component f-node-input",
        "[class.f-node-input-multiple]": "multiple",
        "[class.f-node-input-disabled]": "disabled()"
      },
      providers: [{
        provide: F_NODE_INPUT,
        useExisting: FNodeInputDirective
      }]
    }]
  }], null, {
    fId: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fInputId",
        required: false
      }]
    }],
    category: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fInputCategory",
        required: false
      }]
    }],
    multiple: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fInputMultiple",
        required: false
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fInputDisabled",
        required: false
      }]
    }],
    userFConnectableSide: [{
      type: Input,
      args: [{
        alias: "fInputConnectableSide",
        transform: (value) => castToEnum(value, "fInputConnectableSide", EFConnectableSide)
      }]
    }]
  });
})();
var FSourceConnectorBase = class _FSourceConnectorBase extends FConnectorBase {
  get hasConnectionLimits() {
    return !!this.canBeConnectedInputs && this.canBeConnectedInputs.length > 0;
  }
  canConnectTo(targetConnector) {
    const candidates = [targetConnector.fId(), targetConnector.category()];
    return candidates.some((c) => c && this.canBeConnectedInputs?.includes(c));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFSourceConnectorBase_BaseFactory;
    return function FSourceConnectorBase_Factory(__ngFactoryType__) {
      return (ɵFSourceConnectorBase_BaseFactory || (ɵFSourceConnectorBase_BaseFactory = ɵɵgetInheritedFactory(_FSourceConnectorBase)))(__ngFactoryType__ || _FSourceConnectorBase);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _FSourceConnectorBase,
    features: [ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FSourceConnectorBase, [{
    type: Directive
  }], null, null);
})();
var F_NODE_OUTLET = new InjectionToken("F_NODE_OUTLET");
var FNodeOutletBase = class _FNodeOutletBase extends FSourceConnectorBase {
  kind = "outlet";
  _outputs = [];
  get canBeConnected() {
    return !this.disabled() && this._outputs.some((output2) => output2.canBeConnected);
  }
  setOutputs(outputs) {
    this._outputs = outputs;
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFNodeOutletBase_BaseFactory;
    return function FNodeOutletBase_Factory(__ngFactoryType__) {
      return (ɵFNodeOutletBase_BaseFactory || (ɵFNodeOutletBase_BaseFactory = ɵɵgetInheritedFactory(_FNodeOutletBase)))(__ngFactoryType__ || _FNodeOutletBase);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _FNodeOutletBase,
    features: [ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FNodeOutletBase, [{
    type: Directive
  }], null, null);
})();
function isNodeOutlet(element) {
  return !!element.closest("[fNodeOutlet]");
}
var uniqueId$8 = 0;
var FNodeOutletDirective = class _FNodeOutletDirective extends FNodeOutletBase {
  hostElement = inject(ElementRef).nativeElement;
  _mediator = inject(FMediator);
  _node = inject(F_NODE);
  fId = input(`f-node-outlet-${uniqueId$8++}`, ...ngDevMode ? [{
    debugName: "fId",
    alias: "fOutletId",
    transform: (value) => stringAttribute(value) || `f-node-outlet-${uniqueId$8++}`
  }] : [{
    alias: "fOutletId",
    transform: (value) => stringAttribute(value) || `f-node-outlet-${uniqueId$8++}`
  }]);
  disabled = input(false, ...ngDevMode ? [{
    debugName: "disabled",
    alias: "fOutletDisabled",
    transform: booleanAttribute
  }] : [{
    alias: "fOutletDisabled",
    transform: booleanAttribute
  }]);
  fConnectableSide = EFConnectableSide.AUTO;
  userFConnectableSide = EFConnectableSide.AUTO;
  isConnectionFromOutlet = false;
  canBeConnectedInputs = [];
  get fNodeId() {
    return this._node.fId();
  }
  get fNodeHost() {
    return this._node.hostElement;
  }
  ngOnInit() {
    this._mediator.execute(new AddConnectorToStoreRequest(this));
  }
  ngOnDestroy() {
    this._mediator.execute(new RemoveConnectorFromStoreRequest(this));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFNodeOutletDirective_BaseFactory;
    return function FNodeOutletDirective_Factory(__ngFactoryType__) {
      return (ɵFNodeOutletDirective_BaseFactory || (ɵFNodeOutletDirective_BaseFactory = ɵɵgetInheritedFactory(_FNodeOutletDirective)))(__ngFactoryType__ || _FNodeOutletDirective);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _FNodeOutletDirective,
    selectors: [["", "fNodeOutlet", ""]],
    hostAttrs: [1, "f-component", "f-node-outlet"],
    hostVars: 3,
    hostBindings: function FNodeOutletDirective_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("data-f-outlet-id", ctx.fId());
        ɵɵclassProp("f-node-outlet-disabled", ctx.disabled());
      }
    },
    inputs: {
      fId: [1, "fOutletId", "fId"],
      disabled: [1, "fOutletDisabled", "disabled"],
      isConnectionFromOutlet: "isConnectionFromOutlet",
      canBeConnectedInputs: [0, "fCanBeConnectedInputs", "canBeConnectedInputs"]
    },
    exportAs: ["fNodeOutlet"],
    standalone: false,
    features: [ɵɵProvidersFeature([{
      provide: F_NODE_OUTLET,
      useExisting: _FNodeOutletDirective
    }]), ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FNodeOutletDirective, [{
    type: Directive,
    args: [{
      standalone: false,
      selector: "[fNodeOutlet]",
      exportAs: "fNodeOutlet",
      host: {
        "[attr.data-f-outlet-id]": "fId()",
        class: "f-component f-node-outlet",
        "[class.f-node-outlet-disabled]": "disabled()"
      },
      providers: [{
        provide: F_NODE_OUTLET,
        useExisting: FNodeOutletDirective
      }]
    }]
  }], null, {
    fId: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fOutletId",
        required: false
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fOutletDisabled",
        required: false
      }]
    }],
    isConnectionFromOutlet: [{
      type: Input
    }],
    canBeConnectedInputs: [{
      type: Input,
      args: [{
        alias: "fCanBeConnectedInputs"
      }]
    }]
  });
})();
var F_NODE_OUTPUT = new InjectionToken("F_NODE_OUTPUT");
var FNodeOutputBase = class _FNodeOutputBase extends FSourceConnectorBase {
  kind = "output";
  get canBeConnected() {
    return !this.disabled() && (this.multiple() ? true : !this.isConnected);
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFNodeOutputBase_BaseFactory;
    return function FNodeOutputBase_Factory(__ngFactoryType__) {
      return (ɵFNodeOutputBase_BaseFactory || (ɵFNodeOutputBase_BaseFactory = ɵɵgetInheritedFactory(_FNodeOutputBase)))(__ngFactoryType__ || _FNodeOutputBase);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _FNodeOutputBase,
    features: [ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FNodeOutputBase, [{
    type: Directive
  }], null, null);
})();
function isNodeOutput(element) {
  return !!element.closest("[fNodeOutput]");
}
var uniqueId$7 = 0;
var FNodeOutputDirective = class _FNodeOutputDirective extends FNodeOutputBase {
  hostElement = inject(ElementRef).nativeElement;
  _mediator = inject(FMediator);
  _node = inject(F_NODE);
  fId = input(`f-node-output-${uniqueId$7++}`, ...ngDevMode ? [{
    debugName: "fId",
    alias: "fOutputId",
    transform: (value) => stringAttribute(value) || `f-node-output-${uniqueId$7++}`
  }] : [{
    alias: "fOutputId",
    transform: (value) => stringAttribute(value) || `f-node-output-${uniqueId$7++}`
  }]);
  multiple = input(false, ...ngDevMode ? [{
    debugName: "multiple",
    alias: "fOutputMultiple",
    transform: booleanAttribute
  }] : [{
    alias: "fOutputMultiple",
    transform: booleanAttribute
  }]);
  disabled = input(false, ...ngDevMode ? [{
    debugName: "disabled",
    alias: "fOutputDisabled",
    transform: booleanAttribute
  }] : [{
    alias: "fOutputDisabled",
    transform: booleanAttribute
  }]);
  userFConnectableSide = EFConnectableSide.AUTO;
  isSelfConnectable = true;
  canBeConnectedInputs = [];
  get fNodeId() {
    return this._node.fId();
  }
  get fNodeHost() {
    return this._node.hostElement;
  }
  ngOnInit() {
    this._mediator.execute(new AddConnectorToStoreRequest(this));
    this._node.addConnector(this);
  }
  ngOnChanges(changes) {
    if (changes["userFConnectableSide"]) {
      this._node.refresh();
    }
  }
  setConnected(toConnector) {
    super.setConnected(toConnector);
    this.hostElement.classList.toggle(F_CSS_CLASS.CONNECTOR.OUTPUT_CONNECTED, true);
    this.hostElement.classList.toggle(F_CSS_CLASS.CONNECTOR.OUTPUT_NOT_CONNECTABLE, !this.canBeConnected);
  }
  resetConnected() {
    super.resetConnected();
    this.hostElement.classList.toggle(F_CSS_CLASS.CONNECTOR.OUTPUT_CONNECTED, false);
    this.hostElement.classList.toggle(F_CSS_CLASS.CONNECTOR.OUTPUT_NOT_CONNECTABLE, !this.canBeConnected);
  }
  ngOnDestroy() {
    this._node.removeConnector(this);
    this._mediator.execute(new RemoveConnectorFromStoreRequest(this));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFNodeOutputDirective_BaseFactory;
    return function FNodeOutputDirective_Factory(__ngFactoryType__) {
      return (ɵFNodeOutputDirective_BaseFactory || (ɵFNodeOutputDirective_BaseFactory = ɵɵgetInheritedFactory(_FNodeOutputDirective)))(__ngFactoryType__ || _FNodeOutputDirective);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _FNodeOutputDirective,
    selectors: [["", "fNodeOutput", ""]],
    hostAttrs: [1, "f-component", "f-node-output"],
    hostVars: 7,
    hostBindings: function FNodeOutputDirective_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("data-f-output-id", ctx.fId());
        ɵɵclassProp("f-node-output-multiple", ctx.multiple)("f-node-output-disabled", ctx.disabled())("f-node-output-self-connectable", ctx.isSelfConnectable);
      }
    },
    inputs: {
      fId: [1, "fOutputId", "fId"],
      multiple: [1, "fOutputMultiple", "multiple"],
      disabled: [1, "fOutputDisabled", "disabled"],
      userFConnectableSide: [2, "fOutputConnectableSide", "userFConnectableSide", (value) => castToEnum(value, "fOutputConnectableSide", EFConnectableSide)],
      isSelfConnectable: "isSelfConnectable",
      canBeConnectedInputs: [0, "fCanBeConnectedInputs", "canBeConnectedInputs"]
    },
    exportAs: ["fNodeOutput"],
    standalone: false,
    features: [ɵɵProvidersFeature([{
      provide: F_NODE_OUTPUT,
      useExisting: _FNodeOutputDirective
    }]), ɵɵInheritDefinitionFeature, ɵɵNgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FNodeOutputDirective, [{
    type: Directive,
    args: [{
      standalone: false,
      selector: "[fNodeOutput]",
      exportAs: "fNodeOutput",
      host: {
        "[attr.data-f-output-id]": "fId()",
        class: "f-component f-node-output",
        "[class.f-node-output-multiple]": "multiple",
        "[class.f-node-output-disabled]": "disabled()",
        "[class.f-node-output-self-connectable]": "isSelfConnectable"
      },
      providers: [{
        provide: F_NODE_OUTPUT,
        useExisting: FNodeOutputDirective
      }]
    }]
  }], null, {
    fId: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fOutputId",
        required: false
      }]
    }],
    multiple: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fOutputMultiple",
        required: false
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fOutputDisabled",
        required: false
      }]
    }],
    userFConnectableSide: [{
      type: Input,
      args: [{
        alias: "fOutputConnectableSide",
        transform: (value) => castToEnum(value, "fOutputConnectableSide", EFConnectableSide)
      }]
    }],
    isSelfConnectable: [{
      type: Input
    }],
    canBeConnectedInputs: [{
      type: Input,
      args: [{
        alias: "fCanBeConnectedInputs"
      }]
    }]
  });
})();
var F_CONNECTORS_PROVIDERS = [FNodeInputDirective, FNodeOutletDirective, FNodeOutputDirective];
var CreateConnectionFinalizeRequest = class {
  event;
  static fToken = Symbol("CreateConnectionFinalizeRequest");
  constructor(event) {
    this.event = event;
  }
};
var ResolveConnectableOutputForOutletRequest = class {
  outlet;
  static fToken = Symbol("ResolveConnectableOutputForOutletRequest");
  constructor(outlet) {
    this.outlet = outlet;
  }
};
var ResolveConnectableOutputForOutlet = class ResolveConnectableOutputForOutlet2 {
  _store = inject(FComponentsStore);
  handle({
    outlet
  }) {
    const node = this._findOwnerNode(outlet);
    if (!node) {
      throw new Error("The fOutlet must belong to an fNode");
    }
    const output2 = this._findFirstConnectableOutputInNode(node);
    if (!output2) {
      throw new Error("Outlet requires at least one connectable output in the same node.");
    }
    return output2;
  }
  _findOwnerNode(outlet) {
    const host = outlet.hostElement;
    return this._store.nodes.getAll().find((n) => n.isContains(host));
  }
  _findFirstConnectableOutputInNode(node) {
    return this._store.outputs.getAll().find((x) => node.isContains(x.hostElement) && x.canBeConnected);
  }
  static ɵfac = function ResolveConnectableOutputForOutlet_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ResolveConnectableOutputForOutlet2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ResolveConnectableOutputForOutlet2,
    factory: ResolveConnectableOutputForOutlet2.ɵfac
  });
};
ResolveConnectableOutputForOutlet = __decorate([FExecutionRegister(ResolveConnectableOutputForOutletRequest)], ResolveConnectableOutputForOutlet);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResolveConnectableOutputForOutlet, [{
    type: Injectable
  }], null, null);
})();
var FCreateConnectionEvent = class {
  // -----------------------------
  // Preferred API
  // -----------------------------
  /** Source connector id */
  sourceId;
  /** Target connector id (can be undefined if dropped to nowhere) */
  targetId;
  /** Pointer position where the user dropped pointer. */
  dropPosition;
  // -----------------------------
  // Deprecated compatibility API (keep as FIELDS)
  // -----------------------------
  /** @deprecated Use `sourceId` */
  fOutputId;
  /** @deprecated Use `targetId` */
  fInputId;
  /** @deprecated Use `dropPosition` */
  fDropPosition;
  constructor(sourceId, targetId, dropPosition) {
    this.sourceId = sourceId;
    this.targetId = targetId;
    this.dropPosition = dropPosition;
    this.fOutputId = sourceId;
    this.fInputId = targetId;
    this.fDropPosition = dropPosition;
  }
};
var CreateConnectionHandler = class _CreateConnectionHandler extends DragHandlerBase {
  type = "create-connection";
  kind = "create-connection";
  data() {
    return {
      fOutputOrOutletId: this._sourceRef.connector.fId()
    };
  }
  _result = inject(FDragHandlerResult);
  _mediator = inject(FMediator);
  _connectionBehaviour = inject(ConnectionBehaviourBuilder);
  _store = inject(FComponentsStore);
  get _connection() {
    return this._store.connections.getForCreate();
  }
  get _snapConnection() {
    return this._store.connections.getForSnap();
  }
  _targets = [];
  _sourceRef;
  _pointerDown = new RoundedRect();
  initialize(source, pointer) {
    this._sourceRef = this._mediator.execute(new GetConnectorRectReferenceRequest(source));
    this._pointerDown = RoundedRect.fromRect(RectExtensions.initialize(pointer.x, pointer.y));
  }
  prepareDragSequence() {
    this._collectAndMarkTargets();
    this._initSnapConnection();
    this._initCreateConnection();
    this._connection.show();
    this.onPointerMove(PointExtensions.initialize());
    this._result.setData({
      toConnectorRect: this._pointerDown,
      canBeConnectedInputs: this._targets,
      fOutputId: this._sourceRef.connector.fId()
    });
  }
  _collectAndMarkTargets() {
    this._targets = this._mediator.execute(new CalculateTargetConnectorsToConnectRequest(this._sourceRef.connector, this._sourceRef.rect.gravityCenter));
    this._mediator.execute(new MarkConnectableConnectorsRequest(this._targets.map((x) => x.connector)));
  }
  _initSnapConnection() {
    if (!this._snapConnection) {
      return;
    }
    this._snapConnection.fOutputId.set(this._sourceRef.connector.fId());
    this._snapConnection.initialize();
  }
  _initCreateConnection() {
    this._connection.fOutputId.set(this._sourceRef.connector.fId());
    this._connection.initialize();
  }
  onPointerMove(difference) {
    const pointer = this._pointerDown.addPoint(difference);
    const closest = this._findClosestTarget(pointer);
    const targetSide = closest?.connector.fConnectableSide || EFConnectableSide.TOP;
    this._drawCreateConnection(pointer, targetSide);
    const snap = this._snapConnection;
    if (!snap) {
      return;
    }
    const snapTarget = closest && closest.distance < snap.fSnapThreshold ? closest : void 0;
    this._drawSnapConnection(snapTarget);
  }
  _findClosestTarget(pointer) {
    return this._mediator.execute(new CalculateClosestConnectorRequest(pointer, this._targets));
  }
  _drawCreateConnection(pointer, targetSide) {
    const line = this._connectionBehaviour.handle(new ConnectionBehaviourBuilderRequest(this._sourceRef.rect, pointer, this._connection, this._sourceRef.connector.fConnectableSide, targetSide, this._resolveRotationContext(this._sourceRef.connector)));
    this._connection.setLine(line);
    this._connection.redraw();
  }
  _drawSnapConnection(target) {
    const snap = this._snapConnection;
    if (!snap) {
      return;
    }
    if (!target) {
      snap.hide();
      return;
    }
    const line = this._connectionBehaviour.handle(new ConnectionBehaviourBuilderRequest(this._sourceRef.rect, target.rect, snap, this._sourceRef.connector.fConnectableSide, target.connector.fConnectableSide, this._resolveRotationContext(this._sourceRef.connector), this._resolveRotationContext(target.connector)));
    snap.show();
    snap.setLine(line);
    snap.redraw();
  }
  onPointerUp() {
    this._connection.redraw();
    this._connection.hide();
    this._snapConnection?.hide();
    this._mediator.execute(new UnmarkConnectableConnectorsRequest(this._targets.map((x) => x.connector)));
  }
  _resolveRotationContext(connector) {
    return this._mediator.execute(new ResolveConnectionEndpointRotationContextRequest(connector));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵCreateConnectionHandler_BaseFactory;
    return function CreateConnectionHandler_Factory(__ngFactoryType__) {
      return (ɵCreateConnectionHandler_BaseFactory || (ɵCreateConnectionHandler_BaseFactory = ɵɵgetInheritedFactory(_CreateConnectionHandler)))(__ngFactoryType__ || _CreateConnectionHandler);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _CreateConnectionHandler,
    factory: _CreateConnectionHandler.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CreateConnectionHandler, [{
    type: Injectable
  }], null, null);
})();
var CreateConnectionFinalize = class CreateConnectionFinalize2 {
  _result = inject(FDragHandlerResult);
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  _dragContext = inject(FDraggableDataContext);
  get _dragHandler() {
    return this._dragContext.draggableItems[0];
  }
  handle(request) {
    if (!this._isValid()) {
      return;
    }
    this._emitEvent(request.event);
    this._dragHandler.onPointerUp();
  }
  _isValid() {
    return this._dragContext.draggableItems.some((x) => x instanceof CreateConnectionHandler);
  }
  _getTargetOutput(output2) {
    if (!output2) {
      throw new Error(`Output with fOutputId ${this._result.getData().fOutputId} not found. Make sure there is no f-connection to a non-existent fOutput.`);
    }
    return isNodeOutlet(output2.hostElement) ? this._mediator.execute(new ResolveConnectableOutputForOutletRequest(output2)) : output2;
  }
  _getOutput() {
    return this._store.outputs.get(this._result.getData().fOutputId);
  }
  _getOutlet() {
    return this._store.outlets.get(this._result.getData().fOutputId);
  }
  _emitEvent(event) {
    this._store.fDraggable?.fCreateConnection.emit(new FCreateConnectionEvent(this._getTargetOutput(this._getOutput() || this._getOutlet()).fId(), this._getInputUnderPointer(event)?.fId(), event.getPosition()));
  }
  _getInputUnderPointer(event) {
    return this._mediator.execute(new FindConnectableConnectorUsingPriorityAndPositionRequest(event.getPosition(), this._result.getData().canBeConnectedInputs));
  }
  static ɵfac = function CreateConnectionFinalize_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CreateConnectionFinalize2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CreateConnectionFinalize2,
    factory: CreateConnectionFinalize2.ɵfac
  });
};
CreateConnectionFinalize = __decorate([FExecutionRegister(CreateConnectionFinalizeRequest)], CreateConnectionFinalize);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CreateConnectionFinalize, [{
    type: Injectable
  }], null, null);
})();
var CreateConnectionCreateDragHandlerRequest = class {
  eventPosition;
  source;
  static fToken = Symbol("CreateConnectionCreateDragHandlerRequest");
  constructor(eventPosition, source) {
    this.eventPosition = eventPosition;
    this.source = source;
  }
};
var CreateConnectionCreateDragHandler = class CreateConnectionCreateDragHandler2 {
  _store = inject(FComponentsStore);
  _dragContext = inject(FDraggableDataContext);
  _dragInjector = inject(DragHandlerInjector);
  get _transform() {
    return this._store.transform;
  }
  handle({
    source,
    eventPosition
  }) {
    this._dragContext.onPointerDownScale = this._transform.scale;
    const pointerDownInFlowSpace = this._toFlowSpace(eventPosition);
    this._dragContext.onPointerDownPosition = pointerDownInFlowSpace;
    const pointerDownInCanvasSpace = this._toCanvasSpace(pointerDownInFlowSpace);
    const handler = this._dragInjector.get(CreateConnectionHandler);
    handler.initialize(source, pointerDownInCanvasSpace);
    this._dragContext.draggableItems = [handler];
  }
  /**
   * Converts raw pointer position to "flow host space":
   * - applies elementTransform(flowHost)
   * - normalizes by scale
   */
  _toFlowSpace(position) {
    return Point.fromPoint(position).elementTransform(this._store.flowHost).div(this._transform.scale);
  }
  /**
   * Converts from flow space to "canvas local space":
   * - removes transform offsets (position, scaledPosition)
   * - keeps normalization consistent
   *
   * (Same math as your original chain, just named.)
   */
  _toCanvasSpace(flowSpace) {
    return Point.fromPoint(flowSpace).mult(this._transform.scale).sub(this._transform.position).sub(this._transform.scaledPosition).div(this._transform.scale);
  }
  static ɵfac = function CreateConnectionCreateDragHandler_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CreateConnectionCreateDragHandler2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CreateConnectionCreateDragHandler2,
    factory: CreateConnectionCreateDragHandler2.ɵfac
  });
};
CreateConnectionCreateDragHandler = __decorate([FExecutionRegister(CreateConnectionCreateDragHandlerRequest)], CreateConnectionCreateDragHandler);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CreateConnectionCreateDragHandler, [{
    type: Injectable
  }], null, null);
})();
var CreateConnectionFromOutletPreparationRequest = class {
  event;
  node;
  static fToken = Symbol("CreateConnectionFromOutletPreparationRequest");
  constructor(event, node) {
    this.event = event;
    this.node = node;
  }
};
var CreateConnectionFromOutletPreparation = class CreateConnectionFromOutletPreparation2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  handle({
    event,
    node
  }) {
    const outlet = this._findOutlet(node);
    if (!outlet) {
      return;
    }
    outlet.setOutputs(this._getOutputs(node));
    if (!outlet.canBeConnected) {
      return;
    }
    const source = outlet.isConnectionFromOutlet ? outlet : this._resolveOutput(outlet);
    if (!source || !source.canBeConnected) {
      return;
    }
    this._startDrag(event.getPosition(), source);
  }
  _findOutlet(node) {
    return this._store.outlets.getAll().find((x) => node.isContains(x.hostElement));
  }
  _getOutputs(node) {
    return this._store.outputs.getAll().filter((x) => node.isContains(x.hostElement));
  }
  _resolveOutput(outlet) {
    return this._mediator.execute(new ResolveConnectableOutputForOutletRequest(outlet));
  }
  _startDrag(position, source) {
    this._mediator.execute(new CreateConnectionCreateDragHandlerRequest(position, source));
  }
  static ɵfac = function CreateConnectionFromOutletPreparation_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CreateConnectionFromOutletPreparation2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CreateConnectionFromOutletPreparation2,
    factory: CreateConnectionFromOutletPreparation2.ɵfac
  });
};
CreateConnectionFromOutletPreparation = __decorate([FExecutionRegister(CreateConnectionFromOutletPreparationRequest)], CreateConnectionFromOutletPreparation);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CreateConnectionFromOutletPreparation, [{
    type: Injectable
  }], null, null);
})();
var CreateConnectionFromOutputPreparationRequest = class {
  event;
  node;
  static fToken = Symbol("CreateConnectionFromOutputPreparationRequest");
  constructor(event, node) {
    this.event = event;
    this.node = node;
  }
};
var CreateConnectionFromOutputPreparation = class CreateConnectionFromOutputPreparation2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  handle({
    event,
    node
  }) {
    if (!isNodeOutput(event.targetElement) || this._hasOutlet(node)) {
      return;
    }
    const output2 = this._findOutput(event.targetElement);
    if (!output2 || !output2.canBeConnected) {
      return;
    }
    this._startDrag(event.getPosition(), output2);
  }
  _hasOutlet(node) {
    return this._store.outlets.getAll().some((x) => node.isContains(x.hostElement));
  }
  _findOutput(target) {
    return this._store.outputs.getAll().find((x) => x.hostElement.contains(target));
  }
  _startDrag(position, source) {
    this._mediator.execute(new CreateConnectionCreateDragHandlerRequest(position, source));
  }
  static ɵfac = function CreateConnectionFromOutputPreparation_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CreateConnectionFromOutputPreparation2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CreateConnectionFromOutputPreparation2,
    factory: CreateConnectionFromOutputPreparation2.ɵfac
  });
};
CreateConnectionFromOutputPreparation = __decorate([FExecutionRegister(CreateConnectionFromOutputPreparationRequest)], CreateConnectionFromOutputPreparation);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CreateConnectionFromOutputPreparation, [{
    type: Injectable
  }], null, null);
})();
var CreateConnectionPreparationRequest = class {
  event;
  fTrigger;
  static fToken = Symbol("CreateConnectionPreparationRequest");
  constructor(event, fTrigger) {
    this.event = event;
    this.fTrigger = fTrigger;
  }
};
var CreateConnectionPreparation = class CreateConnectionPreparation2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  _dragContext = inject(FDraggableDataContext);
  handle({
    event,
    fTrigger
  }) {
    if (!this._isValidConditions() || !this._isValidTrigger(event, fTrigger)) {
      return;
    }
    const isOutlet = isNodeOutlet(event.targetElement);
    const isOutput = !isOutlet && isNodeOutput(event.targetElement);
    if (!isOutlet && !isOutput) {
      return;
    }
    const node = this._findOwnerNode(event.targetElement);
    if (!node) {
      return;
    }
    if (isOutlet) {
      this._mediator.execute(new CreateConnectionFromOutletPreparationRequest(event, node));
    } else {
      this._mediator.execute(new CreateConnectionFromOutputPreparationRequest(event, node));
    }
  }
  _findOwnerNode(target) {
    return this._store.nodes.getAll().find((n) => n.isContains(target));
  }
  _isValidConditions() {
    return this._dragContext.isEmpty() && !!this._store.connections.getForCreate();
  }
  _isValidTrigger(event, fTrigger) {
    return isValidEventTrigger(event.originalEvent, fTrigger);
  }
  static ɵfac = function CreateConnectionPreparation_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CreateConnectionPreparation2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CreateConnectionPreparation2,
    factory: CreateConnectionPreparation2.ɵfac
  });
};
CreateConnectionPreparation = __decorate([FExecutionRegister(CreateConnectionPreparationRequest)], CreateConnectionPreparation);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CreateConnectionPreparation, [{
    type: Injectable
  }], null, null);
})();
var ReassignConnectionFinalizeRequest = class {
  event;
  static fToken = Symbol("ReassignConnectionFinalizeRequest");
  constructor(event) {
    this.event = event;
  }
};
var FReassignConnectionEvent = class {
  // -----------------------------
  // Preferred API
  // -----------------------------
  connectionId;
  /** Which endpoint was reassigned. */
  endpoint;
  /** Previous and next ids; `next*Id` can be `undefined` if dropped to nowhere. */
  previousSourceId;
  nextSourceId;
  previousTargetId;
  nextTargetId;
  /** Pointer position where the user dropped pointer. */
  dropPosition;
  // -----------------------------
  // Deprecated compatibility API (keep as FIELDS)
  // -----------------------------
  /** @deprecated Use `endpoint === 'source'` */
  isSourceReassign;
  /** @deprecated Use `endpoint === 'target'` */
  isTargetReassign;
  /** @deprecated Use `previousSourceId` */
  oldSourceId;
  /** @deprecated Use `nextSourceId` */
  newSourceId;
  /** @deprecated Use `previousTargetId` */
  oldTargetId;
  /** @deprecated Use `nextTargetId` */
  newTargetId;
  /** @deprecated Use `dropPosition` */
  dropPoint;
  constructor(connectionId, endpoint, previousSourceId, nextSourceId, previousTargetId, nextTargetId, dropPosition) {
    this.connectionId = connectionId;
    this.endpoint = endpoint;
    this.previousSourceId = previousSourceId;
    this.nextSourceId = nextSourceId;
    this.previousTargetId = previousTargetId;
    this.nextTargetId = nextTargetId;
    this.dropPosition = dropPosition;
    this.isSourceReassign = endpoint === "source";
    this.isTargetReassign = endpoint === "target";
    this.oldSourceId = previousSourceId;
    this.newSourceId = nextSourceId;
    this.oldTargetId = previousTargetId;
    this.newTargetId = nextTargetId;
    this.dropPoint = dropPosition;
  }
};
var ReassignConnectionFinalize = class ReassignConnectionFinalize2 {
  _dragResult = inject(FDragHandlerResult);
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  _dragContext = inject(FDraggableDataContext);
  get _dragDirective() {
    return this._store.fDraggable;
  }
  handle({
    event
  }) {
    const handler = this._findReassignHandler();
    if (!handler) {
      return;
    }
    this._emitIfChanged(event);
    handler.onPointerUp();
  }
  _findReassignHandler() {
    const result = this._dragContext.draggableItems.find((x) => x.getEvent().fEventType === "reassign-connection");
    return result;
  }
  _emitIfChanged(event) {
    const data = this._dragResult.getData();
    const nextConnector = this._findConnectableConnector(event, data.candidates);
    if (nextConnector && !this._isReassignedToDifferentConnector(data, nextConnector)) {
      return;
    }
    this._dragDirective.fReassignConnection.emit(this._buildEvent(data, event, nextConnector));
  }
  _findConnectableConnector(event, connectable) {
    return this._mediator.execute(new FindConnectableConnectorUsingPriorityAndPositionRequest(event.getPosition(), connectable));
  }
  _isReassignedToDifferentConnector(data, next) {
    const connection = data.connection;
    if (data.draggedEnd === "target") {
      return connection.fInputId() !== next.fId();
    }
    return connection.fOutputId() !== next.fId();
  }
  _buildEvent(data, event, next) {
    const connection = data.connection;
    return new FReassignConnectionEvent(connection.fId(), data.draggedEnd, connection.fOutputId(), data.draggedEnd === "source" ? next?.fId() : void 0, connection.fInputId(), data.draggedEnd === "target" ? next?.fId() : void 0, event.getPosition());
  }
  static ɵfac = function ReassignConnectionFinalize_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ReassignConnectionFinalize2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ReassignConnectionFinalize2,
    factory: ReassignConnectionFinalize2.ɵfac
  });
};
ReassignConnectionFinalize = __decorate([FExecutionRegister(ReassignConnectionFinalizeRequest)], ReassignConnectionFinalize);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ReassignConnectionFinalize, [{
    type: Injectable
  }], null, null);
})();
var ReassignConnectionPreparationRequest = class {
  event;
  fTrigger;
  static fToken = Symbol("ReassignConnectionPreparationRequest");
  constructor(event, fTrigger) {
    this.event = event;
    this.fTrigger = fTrigger;
  }
};
function isPointerInsideStartOrEndDragHandles(connection, position) {
  return isDragHandleEnd(connection, position) || isDragHandleStart(connection, position);
}
function isDragHandleEnd(connection, position) {
  return connection.fDragHandleEnd()?.point && _isPointInsideCircle(position, connection.fDragHandleEnd().point) && !connection.fDraggingDisabled();
}
function isDragHandleStart(connection, position) {
  return !!connection.fDragHandleStart()?.point && _isPointInsideCircle(position, connection.fDragHandleStart().point) && !connection.fDraggingDisabled() && connection.fReassignableStart();
}
function _isPointInsideCircle(point, circleCenter) {
  return (point.x - circleCenter.x) ** 2 + (point.y - circleCenter.y) ** 2 <= 8 ** 2;
}
function withinSnapThreshold(fClosestConnector, snapConnection) {
  return fClosestConnector && fClosestConnector.distance < snapConnection.fSnapThreshold ? fClosestConnector : void 0;
}
function rectFromPoint(point) {
  return RoundedRect.fromRect(RectExtensions.initialize(point.x, point.y));
}
var ReassignConnectionSourceHandler = class {
  _mediator;
  _behaviour;
  _connection;
  _sourceRef;
  _targetRef;
  _candidates = [];
  _snap;
  _anchorRect;
  get _source() {
    return this._sourceRef.connector;
  }
  get _target() {
    return this._targetRef.connector;
  }
  constructor(_mediator, _behaviour, _connection, _sourceRef, _targetRef) {
    this._mediator = _mediator;
    this._behaviour = _behaviour;
    this._connection = _connection;
    this._sourceRef = _sourceRef;
    this._targetRef = _targetRef;
    this._anchorRect = rectFromPoint(this._connection.line.point1);
  }
  candidates() {
    return this._candidates;
  }
  collectAndMarkCandidates() {
    this._candidates = this._mediator.execute(new CalculateSourceConnectorsToConnectRequest(this._target, this._targetRef.rect.gravityCenter));
    if (!this._candidates.some((x) => x.connector.fId() === this._source.fId())) {
      this._candidates.push(this._sourceRef);
    }
    this._mediator.execute(new MarkConnectableConnectorsRequest(this._candidates.map((x) => x.connector)));
  }
  setSnapConnection(snap) {
    this._snap = snap;
    if (!snap) {
      return;
    }
    snap.fInputId.set(this._connection.fInputId());
    snap.initialize();
  }
  onPointerMove(difference) {
    const pointerRect = this._anchorRect.addPoint(difference);
    const closest = this._findClosest(pointerRect.gravityCenter);
    const sourceSide = closest?.connector.fConnectableSide ?? this._source.fConnectableSide;
    this._draw(pointerRect, sourceSide);
    const snap = this._snap;
    if (!snap) {
      return;
    }
    this._drawSnap(withinSnapThreshold(closest, snap));
  }
  _findClosest(point) {
    return this._mediator.execute(new CalculateClosestConnectorRequest(point, this._candidates));
  }
  _draw(sourceRect, sourceSide) {
    const line = this._behaviour.handle(new ConnectionBehaviourBuilderRequest(sourceRect, this._targetRef.rect, this._connection, sourceSide, this._targetRef.connector.fConnectableSide, void 0, this._resolveRotationContext(this._targetRef.connector)));
    this._connection.setLine(line);
    this._connection.redraw();
  }
  _drawSnap(closest) {
    const snap = this._snap;
    if (!snap) {
      return;
    }
    if (!closest) {
      snap.hide();
      return;
    }
    const line = this._behaviour.handle(new ConnectionBehaviourBuilderRequest(closest.rect, this._targetRef.rect, snap, closest.connector.fConnectableSide, this._target.fConnectableSide, this._resolveRotationContext(closest.connector), this._resolveRotationContext(this._targetRef.connector)));
    snap.show();
    snap.setLine(line);
    snap.redraw();
  }
  onPointerUp() {
    this._draw(this._anchorRect, this._sourceRef.connector.fConnectableSide);
    this._snap?.hide();
    this._mediator.execute(new UnmarkConnectableConnectorsRequest(this._candidates.map((x) => x.connector)));
  }
  _resolveRotationContext(connector) {
    return this._mediator.execute(new ResolveConnectionEndpointRotationContextRequest(connector));
  }
};
var ReassignConnectionTargetHandler = class {
  _mediator;
  _behaviour;
  _connection;
  _sourceRef;
  _targetRef;
  _candidates = [];
  _snap;
  _anchorRect;
  get _source() {
    return this._sourceRef.connector;
  }
  get _target() {
    return this._targetRef.connector;
  }
  constructor(_mediator, _behaviour, _connection, _sourceRef, _targetRef) {
    this._mediator = _mediator;
    this._behaviour = _behaviour;
    this._connection = _connection;
    this._sourceRef = _sourceRef;
    this._targetRef = _targetRef;
    this._anchorRect = rectFromPoint(this._connection.line.point2);
  }
  candidates() {
    return this._candidates;
  }
  collectAndMarkCandidates() {
    this._candidates = this._mediator.execute(new CalculateTargetConnectorsToConnectRequest(this._source, this._sourceRef.rect.gravityCenter));
    const currentTargetId = this._connection.fInputId();
    if (currentTargetId && !this._candidates.some((x) => x.connector.fId() === currentTargetId)) {
      this._candidates.push(this._targetRef);
    }
    this._mediator.execute(new MarkConnectableConnectorsRequest(this._candidates.map((x) => x.connector)));
  }
  setSnapConnection(snap) {
    this._snap = snap;
    if (!snap) {
      return;
    }
    snap.fOutputId.set(this._connection.fOutputId());
    snap.initialize();
  }
  onPointerMove(difference) {
    const pointerRect = this._anchorRect.addPoint(difference);
    const closest = this._findClosest(pointerRect.gravityCenter);
    const targetSide = closest?.connector.fConnectableSide ?? this._target.fConnectableSide;
    this._draw(pointerRect, targetSide);
    const snap = this._snap;
    if (!snap) {
      return;
    }
    this._drawSnap(withinSnapThreshold(closest, snap));
  }
  onPointerUp() {
    this._draw(this._anchorRect, this._targetRef.connector.fConnectableSide);
    this._snap?.hide();
    this._mediator.execute(new UnmarkConnectableConnectorsRequest(this._candidates.map((x) => x.connector)));
  }
  _findClosest(point) {
    return this._mediator.execute(new CalculateClosestConnectorRequest(point, this._candidates));
  }
  _draw(targetRect, targetSide) {
    const line = this._behaviour.handle(new ConnectionBehaviourBuilderRequest(this._sourceRef.rect, targetRect, this._connection, this._source.fConnectableSide, targetSide, this._resolveRotationContext(this._sourceRef.connector), void 0));
    this._connection.setLine(line);
    this._connection.redraw();
  }
  _drawSnap(closest) {
    const snap = this._snap;
    if (!snap) {
      return;
    }
    if (!closest) {
      snap.hide();
      return;
    }
    const line = this._behaviour.handle(new ConnectionBehaviourBuilderRequest(this._sourceRef.rect, closest.rect, snap, this._source.fConnectableSide, closest.connector.fConnectableSide, this._resolveRotationContext(this._sourceRef.connector), this._resolveRotationContext(closest.connector)));
    snap.show();
    snap.setLine(line);
    snap.redraw();
  }
  _resolveRotationContext(connector) {
    return this._mediator.execute(new ResolveConnectionEndpointRotationContextRequest(connector));
  }
};
var ReassignConnectionHandler = class _ReassignConnectionHandler extends DragHandlerBase {
  type = "reassign-connection";
  kind = "reassign-connection";
  data() {
    return {
      fConnectionId: this._connection.fId()
    };
  }
  _result = inject(FDragHandlerResult);
  _mediator = inject(FMediator);
  _connectionBehaviour = inject(ConnectionBehaviourBuilder);
  _store = inject(FComponentsStore);
  get _snapConnection() {
    return this._store.connections.getForSnap();
  }
  _connection;
  _draggedEnd;
  _sourceRef;
  _targetRef;
  _reassignHandler;
  initialize(connection, isTargetDragHandle) {
    this._connection = connection;
    this._draggedEnd = isTargetDragHandle ? "target" : "source";
    this._sourceRef = this._mediator.execute(new GetConnectorRectReferenceRequest(this._store.outputs.require(this._connection.fOutputId())));
    this._targetRef = this._mediator.execute(new GetConnectorRectReferenceRequest(this._store.inputs.require(this._connection.fInputId())));
    this._reassignHandler = this._draggedEnd === "target" ? this._createTargetHandler() : this._createSourceHandler();
  }
  _createSourceHandler() {
    return new ReassignConnectionSourceHandler(this._mediator, this._connectionBehaviour, this._connection, this._sourceRef, this._targetRef);
  }
  _createTargetHandler() {
    return new ReassignConnectionTargetHandler(this._mediator, this._connectionBehaviour, this._connection, this._sourceRef, this._targetRef);
  }
  prepareDragSequence() {
    this._reassignHandler.collectAndMarkCandidates();
    this._reassignHandler.setSnapConnection(this._snapConnection);
    this._result.setData({
      draggedEnd: this._draggedEnd,
      sourceAnchorRect: rectFromPoint(this._connection.line.point1),
      targetAnchorRect: rectFromPoint(this._connection.line.point2),
      candidates: this._reassignHandler.candidates(),
      connection: this._connection
    });
  }
  onPointerMove(difference) {
    this._reassignHandler.onPointerMove(difference);
  }
  onPointerUp() {
    this._reassignHandler.onPointerUp();
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵReassignConnectionHandler_BaseFactory;
    return function ReassignConnectionHandler_Factory(__ngFactoryType__) {
      return (ɵReassignConnectionHandler_BaseFactory || (ɵReassignConnectionHandler_BaseFactory = ɵɵgetInheritedFactory(_ReassignConnectionHandler)))(__ngFactoryType__ || _ReassignConnectionHandler);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _ReassignConnectionHandler,
    factory: _ReassignConnectionHandler.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ReassignConnectionHandler, [{
    type: Injectable
  }], null, null);
})();
var ReassignConnectionPreparation = class ReassignConnectionPreparation2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  _dragContext = inject(FDraggableDataContext);
  _dragInjector = inject(DragHandlerInjector);
  get _canvas() {
    return this._store.fCanvas;
  }
  get _transform() {
    return this._store.transform;
  }
  get _connections() {
    return this._store.connections.getAll();
  }
  handle(request) {
    if (!this._dragContext.isEmpty() || !this._isValidTrigger(request)) {
      return;
    }
    const pointerInFlow = calculatePointerInFlow(request.event.getPosition(), this._store.flowHost, this._transform);
    const connection = this._findConnectionAt(pointerInFlow);
    if (!connection) {
      return;
    }
    this._capturePointerDown(request);
    this._startDrag(connection, pointerInFlow);
    queueMicrotask(() => this._bringToFront(connection));
  }
  _findConnectionAt(pointerInFlow) {
    return this._connections.find((c) => isPointerInsideStartOrEndDragHandles(c, pointerInFlow));
  }
  _capturePointerDown(request) {
    this._dragContext.onPointerDownScale = this._transform.scale;
    this._dragContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition()).elementTransform(this._store.flowHost).div(this._transform.scale);
  }
  _startDrag(connection, pointerInFlow) {
    const handle = this._dragInjector.get(ReassignConnectionHandler);
    handle.initialize(connection, isDragHandleEnd(connection, pointerInFlow));
    this._dragContext.draggableItems = [handle];
  }
  _isValidTrigger(request) {
    return isValidEventTrigger(request.event.originalEvent, request.fTrigger);
  }
  _bringToFront(connection) {
    this._mediator.execute(new UpdateItemAndChildrenLayersRequest(connection, this._canvas.fConnectionsContainer().nativeElement));
  }
  static ɵfac = function ReassignConnectionPreparation_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ReassignConnectionPreparation2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ReassignConnectionPreparation2,
    factory: ReassignConnectionPreparation2.ɵfac
  });
};
ReassignConnectionPreparation = __decorate([FExecutionRegister(ReassignConnectionPreparationRequest)], ReassignConnectionPreparation);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ReassignConnectionPreparation, [{
    type: Injectable
  }], null, null);
})();
var DragConnectionWaypointFinalizeRequest = class {
  event;
  static fToken = Symbol("DragConnectionWaypointFinalizeRequest");
  constructor(event) {
    this.event = event;
  }
};
var FConnectionWaypointsChangedEvent = class {
  connectionId;
  waypoints;
  constructor(connectionId, waypoints) {
    this.connectionId = connectionId;
    this.waypoints = waypoints;
  }
};
var DragConnectionWaypointHandler = class _DragConnectionWaypointHandler extends DragHandlerBase {
  type = "move-connection-waypoint";
  kind = "drag-connection-waypoint";
  _store = inject(FComponentsStore);
  _point;
  _pick;
  get _waypointsComponent() {
    return this._pick?.connection.fWaypoints();
  }
  get _connection() {
    return this._pick?.connection;
  }
  setPick(pick) {
    this._pick = pick;
  }
  prepareDragSequence() {
    if (this._pick?.candidate) {
      this._point = __spreadValues({}, this._pick.candidate);
      this._waypointsComponent.insert(this._pick.candidate);
    } else if (this._pick?.waypoint) {
      this._point = __spreadValues({}, this._pick.waypoint);
      this._waypointsComponent.select(this._pick.waypoint);
    }
    this._redrawConnection();
  }
  onPointerMove(_difference) {
    this._waypointsComponent.move(PointExtensions.sum(this._point, _difference));
    this._redrawConnection();
  }
  onPointerUp() {
    this._waypointsComponent.update();
    this._store.fDraggable?.fConnectionWaypointsChanged.emit(this._eventFromPick());
  }
  _redrawConnection() {
    this._connection.setLine(this._connection.line);
    this._connection.redraw();
  }
  _eventFromPick() {
    return new FConnectionWaypointsChangedEvent(this._connection.fId(), this._connection.fWaypoints()?.waypoints() || []);
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵDragConnectionWaypointHandler_BaseFactory;
    return function DragConnectionWaypointHandler_Factory(__ngFactoryType__) {
      return (ɵDragConnectionWaypointHandler_BaseFactory || (ɵDragConnectionWaypointHandler_BaseFactory = ɵɵgetInheritedFactory(_DragConnectionWaypointHandler)))(__ngFactoryType__ || _DragConnectionWaypointHandler);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _DragConnectionWaypointHandler,
    factory: _DragConnectionWaypointHandler.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DragConnectionWaypointHandler, [{
    type: Injectable
  }], null, null);
})();
var DragConnectionWaypointFinalize = class DragConnectionWaypointFinalize2 {
  _dragContext = inject(FDraggableDataContext);
  get _fDragHandler() {
    return this._dragContext.draggableItems[0];
  }
  handle(_request) {
    if (!this._isDroppedConnectionReassignEvent()) {
      return;
    }
    this._fDragHandler.onPointerUp();
  }
  _isDroppedConnectionReassignEvent() {
    return this._dragContext.draggableItems.some((x) => x instanceof DragConnectionWaypointHandler);
  }
  static ɵfac = function DragConnectionWaypointFinalize_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || DragConnectionWaypointFinalize2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: DragConnectionWaypointFinalize2,
    factory: DragConnectionWaypointFinalize2.ɵfac
  });
};
DragConnectionWaypointFinalize = __decorate([FExecutionRegister(DragConnectionWaypointFinalizeRequest)], DragConnectionWaypointFinalize);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DragConnectionWaypointFinalize, [{
    type: Injectable
  }], null, null);
})();
var DragConnectionWaypointPreparationRequest = class {
  event;
  fTrigger;
  static fToken = Symbol("DragConnectionWaypointPreparationRequest");
  constructor(event, fTrigger) {
    this.event = event;
    this.fTrigger = fTrigger;
  }
};
var DragConnectionWaypointPreparation = class DragConnectionWaypointPreparation2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  _dragContext = inject(FDraggableDataContext);
  _dragInjector = inject(DragHandlerInjector);
  get _canvas() {
    return this._store.fCanvas;
  }
  get _transform() {
    return this._canvas.transform;
  }
  get _flowHost() {
    return this._store.flowHost;
  }
  get _connections() {
    return this._store.connections.getAll();
  }
  handle(request) {
    const position = calculatePointerInFlow(request.event.getPosition(), this._flowHost, this._transform);
    const pick = this._pickControlPoint(position);
    if (!pick || !this._isValidTrigger(request)) {
      return;
    }
    const handler = this._dragInjector.get(DragConnectionWaypointHandler);
    handler.setPick(pick);
    this._dragContext.onPointerDownScale = this._transform.scale;
    this._dragContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition()).elementTransform(this._flowHost).div(this._transform.scale);
    this._dragContext.draggableItems = [handler];
    queueMicrotask(() => this._updateConnectionLayer(pick.connection));
  }
  _pickControlPoint(position) {
    if (!this._dragContext.isEmpty()) {
      return void 0;
    }
    return pickWaypoint(this._connections, position);
  }
  _isValidTrigger(request) {
    return isValidEventTrigger(request.event.originalEvent, request.fTrigger);
  }
  _updateConnectionLayer(connection) {
    this._mediator.execute(new UpdateItemAndChildrenLayersRequest(connection, this._canvas.fConnectionsContainer().nativeElement));
  }
  static ɵfac = function DragConnectionWaypointPreparation_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || DragConnectionWaypointPreparation2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: DragConnectionWaypointPreparation2,
    factory: DragConnectionWaypointPreparation2.ɵfac
  });
};
DragConnectionWaypointPreparation = __decorate([FExecutionRegister(DragConnectionWaypointPreparationRequest)], DragConnectionWaypointPreparation);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DragConnectionWaypointPreparation, [{
    type: Injectable
  }], null, null);
})();
var DRAG_CONNECTIONS_PROVIDERS = [CreateConnectionFinalize, CreateConnectionCreateDragHandler, CreateConnectionFromOutletPreparation, ResolveConnectableOutputForOutlet, CreateConnectionFromOutputPreparation, CreateConnectionPreparation, ReassignConnectionFinalize, ReassignConnectionPreparation, DragConnectionWaypointPreparation, DragConnectionWaypointFinalize];
var DropToGroupFinalizeRequest = class {
  event;
  static fToken = Symbol("DropToGroupFinalizeRequest");
  constructor(event) {
    this.event = event;
  }
};
var DEBOUNCE_MS = 1;
var DropToGroupHandler = class _DropToGroupHandler extends DragHandlerBase {
  /** Legacy identifier (external compatibility). */
  type = "move-node-to-parent";
  /** New identifier. */
  kind = "assign-to-container";
  _store = inject(FComponentsStore);
  _dragSession = inject(FDraggableDataContext);
  get _transform() {
    return this._store.transform;
  }
  _candidateGroups = [];
  _debounceTimer = null;
  _activeTarget = null;
  /** Read-only access for finalize stage. */
  get activeTarget() {
    return this._activeTarget;
  }
  initialize(candidateGroups) {
    this._candidateGroups = candidateGroups;
  }
  prepareDragSequence() {
    for (const {
      node
    } of this._candidateGroups) {
      node.hostElement.classList.add(F_CSS_CLASS.GROUPING.DROP_ACTIVE);
    }
  }
  onPointerMove(difference) {
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }
    this._debounceTimer = setTimeout(() => this._updateActiveTarget(difference), DEBOUNCE_MS);
  }
  onPointerUp() {
    this._clearActiveTarget();
    for (const {
      node
    } of this._candidateGroups) {
      node.hostElement.classList.remove(F_CSS_CLASS.GROUPING.DROP_ACTIVE);
    }
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
      this._debounceTimer = null;
    }
  }
  _updateActiveTarget(difference) {
    const pointerInFlow = this._getPointerInFlow(difference);
    const next = this._findTargetUnderPointer(pointerInFlow);
    if (next) {
      this._setActiveTarget(next);
    } else {
      this._clearActiveTarget();
    }
  }
  _getPointerInFlow(difference) {
    const pointerInScaledFlow = Point.fromPoint(this._dragSession.onPointerDownPosition).add(difference);
    const transformOffsetInFlow = Point.fromPoint(this._transform.position).add(this._transform.scaledPosition).div(this._transform.scale);
    return pointerInScaledFlow.sub(transformOffsetInFlow);
  }
  _findTargetUnderPointer(pointer) {
    return this._candidateGroups.find((x) => RectExtensions.isIncludePoint(x.rect, pointer));
  }
  _setActiveTarget(target) {
    if (this._activeTarget?.node === target.node) {
      return;
    }
    this._clearActiveTarget();
    this._activeTarget = target;
    target.node.setClass(F_CSS_CLASS.GROUPING.OVER_BOUNDARY);
  }
  _clearActiveTarget() {
    this._activeTarget?.node.removeClass(F_CSS_CLASS.GROUPING.OVER_BOUNDARY);
    this._activeTarget = null;
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵDropToGroupHandler_BaseFactory;
    return function DropToGroupHandler_Factory(__ngFactoryType__) {
      return (ɵDropToGroupHandler_BaseFactory || (ɵDropToGroupHandler_BaseFactory = ɵɵgetInheritedFactory(_DropToGroupHandler)))(__ngFactoryType__ || _DropToGroupHandler);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _DropToGroupHandler,
    factory: _DropToGroupHandler.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DropToGroupHandler, [{
    type: Injectable
  }], null, null);
})();
var CreateDragNodeHierarchyRequest = class {
  nodesAndGroups;
  static fToken = Symbol("CreateDragNodeHierarchyRequest");
  /** Selected nodes and groups including their deep children. */
  constructor(nodesAndGroups) {
    this.nodesAndGroups = nodesAndGroups;
  }
};
var DragNodeHierarchy = class {
  rootHandlers;
  participants;
  constructor(rootHandlers, participants) {
    this.rootHandlers = rootHandlers;
    this.participants = participants;
  }
};
var FDragNodeStartEventData = class {
  fNodeIds;
  constructor(fNodeIds) {
    this.fNodeIds = fNodeIds;
  }
};
var DRAG_NODE_HANDLER_TYPE = "move-node";
var DRAG_NODE_HANDLER_KIND = "drag-node";
function isDragNodeHandler(value) {
  return value.getEvent().kind === DRAG_NODE_HANDLER_KIND || value.getEvent().fEventType === DRAG_NODE_HANDLER_TYPE;
}
var DragNodeHandler = class _DragNodeHandler extends DragHandlerBase {
  type = DRAG_NODE_HANDLER_TYPE;
  kind = DRAG_NODE_HANDLER_KIND;
  data() {
    return new FDragNodeStartEventData(this.items.map((x) => x.nodeOrGroup.fId()));
  }
  _magneticLines = null;
  _magneticRects = null;
  /** Every dragged item (nodes + groups including deep children) */
  items;
  /** Roots of drag hierarchy (top-level items without selected parents) */
  roots;
  initialize(items, roots) {
    this.items = items;
    this.roots = roots;
  }
  setMagneticLines(handler) {
    this._magneticLines = handler;
  }
  setMagneticRects(handler) {
    this._magneticRects = handler;
  }
  calculateMagneticLinesGuides(delta) {
    return this.calculateMagneticSnaps(delta).lines;
  }
  calculateMagneticSnaps(delta) {
    this._previewRoots(delta);
    const draggedRect = this._rootsUnionRect();
    return {
      lines: this._magneticLines?._computeGuides(draggedRect),
      rects: this._magneticRects?._computeRects(draggedRect)
    };
  }
  prepareDragSequence() {
    for (const root of this.roots) {
      root.prepareDragSequence();
    }
  }
  onPointerMove(delta) {
    this._previewRoots(delta);
    const draggedRect = this._rootsUnionRect();
    this._magneticLines?.scheduleRender(draggedRect);
    this._magneticRects?.scheduleRender(draggedRect);
  }
  onPointerUp() {
    for (const root of this.roots) {
      root.onPointerUp();
    }
    this._magneticLines?.clearGuides();
    this._magneticRects?.clearGuides();
    requestAnimationFrame(() => this._refreshDraggedNodes());
  }
  _previewRoots(delta) {
    for (const root of this.roots) {
      root.onPointerMove(delta);
    }
  }
  _rootsUnionRect() {
    let result = null;
    for (const root of this.roots) {
      const rect = root.getLastRect();
      result = result ? RectExtensions.union([result, rect]) : rect;
    }
    return result ?? RectExtensions.initialize();
  }
  _refreshDraggedNodes() {
    for (const {
      nodeOrGroup
    } of this.roots) {
      nodeOrGroup.refresh();
    }
  }
  destroy() {
    for (const root of this.roots ?? []) {
      root.destroy?.();
    }
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵDragNodeHandler_BaseFactory;
    return function DragNodeHandler_Factory(__ngFactoryType__) {
      return (ɵDragNodeHandler_BaseFactory || (ɵDragNodeHandler_BaseFactory = ɵɵgetInheritedFactory(_DragNodeHandler)))(__ngFactoryType__ || _DragNodeHandler);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _DragNodeHandler,
    factory: _DragNodeHandler.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DragNodeHandler, [{
    type: Injectable
  }], null, null);
})();
var DeltaClamp = class {
  _limits;
  _quantizeStep;
  constructor(_limits, _quantizeStep = 0.5) {
    this._limits = _limits;
    this._quantizeStep = _quantizeStep;
  }
  applyInto(offset, out) {
    const {
      min,
      max
    } = this._limits;
    const x = this._clamp(offset.x, min.x, max.x);
    const y = this._clamp(offset.y, min.y, max.y);
    const rawOverflowX = offset.x - x;
    const rawOverflowY = offset.y - y;
    const overflowX = this._quantizeSigned(rawOverflowX, this._quantizeStep);
    const overflowY = this._quantizeSigned(rawOverflowY, this._quantizeStep);
    out.value.x = x;
    out.value.y = y;
    out.edges.left = overflowX < 0;
    out.edges.right = overflowX > 0;
    out.edges.top = overflowY < 0;
    out.edges.bottom = overflowY > 0;
    out.overflow.x = Math.abs(overflowX);
    out.overflow.y = Math.abs(overflowY);
  }
  _quantizeSigned(v, step) {
    if (step <= 0 || v === 0) {
      return 0;
    }
    const k = v / step;
    return (v > 0 ? Math.ceil(k) : Math.floor(k)) * step;
  }
  _clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
};
var GridSnapper = class {
  _pointerDown;
  _vCellSize;
  _hCellSize;
  _snapWhileDragging;
  constructor(data, _pointerDown) {
    this._pointerDown = _pointerDown;
    this._vCellSize = data.vCellSize();
    this._hCellSize = data.hCellSize();
    this._snapWhileDragging = data.fCellSizeWhileDragging();
  }
  snap(difference, adjustCellSize) {
    const _adjustCellSize = adjustCellSize || this._snapWhileDragging;
    return this._strategies[+_adjustCellSize](difference);
  }
  _strategies = {
    0: this._noSnap.bind(this),
    1: this._snapWithCellSize.bind(this)
  };
  _snapWithCellSize(difference) {
    return {
      x: this._snapToGrid(this._pointerDown.x + difference.x, this._hCellSize) - this._pointerDown.x,
      y: this._snapToGrid(this._pointerDown.y + difference.y, this._vCellSize) - this._pointerDown.y
    };
  }
  _noSnap(difference) {
    return difference;
  }
  _snapToGrid(value, cellSize) {
    return Math.round(value / cellSize) * cellSize;
  }
};
function _createClampResult() {
  return {
    value: {
      x: 0,
      y: 0
    },
    overflow: {
      x: 0,
      y: 0
    },
    edges: {
      left: false,
      right: false,
      top: false,
      bottom: false
    }
  };
}
var DragNodeDeltaConstraints = class {
  _snapper;
  _hardClamp;
  _hardResult = _createClampResult();
  _softClamps = [];
  _softResults = [];
  constructor(injector, pointerDown, limits) {
    const dnd = injector.get(FComponentsStore).fDraggable;
    this._snapper = new GridSnapper(dnd, pointerDown);
    this._hardClamp = new DeltaClamp(limits.hard, 0.5);
    for (const soft of limits.soft) {
      this._softClamps.push(new DeltaClamp(soft.limits, 0.5));
      this._softResults.push(_createClampResult());
    }
  }
  apply(delta, forceSnap = false) {
    const snapped = this._snapper.snap(delta, forceSnap);
    this._hardClamp.applyInto(snapped, this._hardResult);
    const hardDelta = {
      x: this._hardResult.value.x,
      y: this._hardResult.value.y
    };
    for (let i = 0; i < this._softClamps.length; i++) {
      this._softClamps[i].applyInto(hardDelta, this._softResults[i]);
    }
    return {
      hardDelta,
      soft: this._softResults
    };
  }
  finalize(delta) {
    return this.apply(delta, true);
  }
};
function expandRectByOverflow(baselineRect, overflowDelta, edges) {
  let {
    x,
    y,
    width,
    height
  } = baselineRect;
  if (edges.right && overflowDelta.x > 0) {
    width += overflowDelta.x;
  }
  if (edges.left && overflowDelta.x > 0) {
    x -= overflowDelta.x;
    width += overflowDelta.x;
  }
  if (edges.bottom && overflowDelta.y > 0) {
    height += overflowDelta.y;
  }
  if (edges.top && overflowDelta.y > 0) {
    y -= overflowDelta.y;
    height += overflowDelta.y;
  }
  return RectExtensions.initialize(x, y, width, height);
}
var DragNodeItemHandler = class extends DragHandlerBase {
  _injector;
  nodeOrGroup;
  children;
  sourceConnectionHandlers;
  targetConnectionHandlers;
  type = DRAG_NODE_HANDLER_TYPE;
  kind = DRAG_NODE_HANDLER_KIND;
  _startPosition = PointExtensions.initialize();
  _startRect = RectExtensions.initialize();
  _applyConstraints = (delta) => delta;
  _lastSoftResults = [];
  _deltaConstraints;
  _constraints;
  _lastPosition = PointExtensions.initialize();
  _softParentConnectionHandlers = [];
  _mediator;
  constructor(_injector, nodeOrGroup, children = [], sourceConnectionHandlers = [], targetConnectionHandlers = []) {
    super();
    this._injector = _injector;
    this.nodeOrGroup = nodeOrGroup;
    this.children = children;
    this.sourceConnectionHandlers = sourceConnectionHandlers;
    this.targetConnectionHandlers = targetConnectionHandlers;
    this._mediator = _injector.get(FMediator);
    this._startRect = this._mediator.execute(new GetNormalizedElementRectRequest(nodeOrGroup.hostElement));
    this._startPosition = __spreadValues({}, nodeOrGroup._position);
  }
  setConstraints(constraints) {
    this._constraints = constraints;
    this._deltaConstraints = new DragNodeDeltaConstraints(this._injector, this._startPosition, constraints);
    this._applyConstraints = (difference) => {
      const summary = this._deltaConstraints.apply(difference);
      this._applySoftExpansions(summary.soft);
      return summary.hardDelta;
    };
  }
  setSoftParentConnectionHandlers(handlers) {
    this._softParentConnectionHandlers = handlers;
  }
  finalizeConstraints() {
    this._applyConstraints = (delta) => {
      const summary = this._deltaConstraints.finalize(delta);
      this._applySoftExpansions(summary.soft);
      return summary.hardDelta;
    };
  }
  getLastRect() {
    return RectExtensions.initialize(this._lastPosition.x, this._lastPosition.y, this._startRect.width, this._startRect.height);
  }
  prepareDragSequence() {
    for (const child of this.children) {
      child.prepareDragSequence();
    }
    this.nodeOrGroup.hostElement.classList.add(F_CSS_CLASS.DRAG_AND_DROP.DRAGGING);
  }
  onPointerMove(delta) {
    const constrained = this._applyConstraints(delta);
    for (const child of this.children) {
      child.onPointerMove(constrained);
    }
    this._redraw(this._startPlus(constrained));
    for (const h of this.sourceConnectionHandlers) {
      h.setSourceDelta(constrained);
    }
    for (const h of this.targetConnectionHandlers) {
      h.setTargetDelta(constrained);
    }
  }
  onPointerUp() {
    for (const child of this.children) {
      child.onPointerUp();
    }
    this.nodeOrGroup.position.set(this.nodeOrGroup._position);
    this.nodeOrGroup.hostElement.classList.remove(F_CSS_CLASS.DRAG_AND_DROP.DRAGGING);
    this._emitExpandedEvent();
  }
  _startPlus(delta) {
    return PointExtensions.sum(this._startPosition, delta);
  }
  _redraw(position) {
    this._lastPosition = position;
    this.nodeOrGroup.updatePosition(position);
    this._mediator.execute(new SetFCacheNodeRectRequest(this.nodeOrGroup.fId(), RectExtensions.initialize(position.x, position.y, this._startRect.width, this._startRect.height)));
    this.nodeOrGroup.redraw();
  }
  _applySoftExpansions(results) {
    this._lastSoftResults = results;
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      const soft = this._constraints.soft[i];
      const expandedRect = expandRectByOverflow(soft.boundingRect, r.overflow, r.edges);
      if (this._commitParentRect(soft.nodeOrGroup, expandedRect)) {
        this._updateParentConnectionHandlers(i);
      }
    }
  }
  _commitParentRect(parent, rect) {
    const changed = parent._position.x !== rect.x || parent._position.y !== rect.y || parent._size?.width !== rect.width || parent._size?.height !== rect.height;
    parent.updateSize({
      width: rect.width,
      height: rect.height
    });
    parent.updatePosition({
      x: rect.x,
      y: rect.y
    });
    this._mediator.execute(new SetFCacheNodeRectRequest(parent.fId(), rect));
    parent.redraw();
    return changed;
  }
  _updateParentConnectionHandlers(softConstraintIndex) {
    const handlers = this._softParentConnectionHandlers[softConstraintIndex];
    if (!handlers) {
      return;
    }
    const currentRectByConnectorId = /* @__PURE__ */ new Map();
    for (const source of handlers.source) {
      const currentRect = this._readConnectorRect(source.connector, currentRectByConnectorId);
      source.handler.setSourceDelta(this._buildDelta(source.baselineRect, currentRect));
    }
    for (const target of handlers.target) {
      const currentRect = this._readConnectorRect(target.connector, currentRectByConnectorId);
      target.handler.setTargetDelta(this._buildDelta(target.baselineRect, currentRect));
    }
  }
  _readConnectorRect(connector, cache) {
    const cacheKey = `${connector.kind}::${connector.fId()}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    const rect = this._mediator.execute(new GetConnectorRectReferenceRequest(connector)).rect;
    cache.set(cacheKey, rect);
    return rect;
  }
  _buildDelta(baselineRect, currentRect) {
    return PointExtensions.initialize(currentRect.x - baselineRect.x, currentRect.y - baselineRect.y);
  }
  _emitExpandedEvent() {
    for (let i = 0; i < this._lastSoftResults.length; i++) {
      const r = this._lastSoftResults[i];
      if (!r.overflow.x && !r.overflow.y) {
        continue;
      }
      const soft = this._constraints.soft[i];
      const expandedRect = expandRectByOverflow(soft.boundingRect, r.overflow, r.edges);
      soft.nodeOrGroup.sizeChange.emit(expandedRect);
    }
  }
  destroy() {
    for (const child of this.children) {
      child.destroy?.();
    }
    this.children = [];
    this.sourceConnectionHandlers = [];
    this.targetConnectionHandlers = [];
    this._lastSoftResults = [];
    this._applyConstraints = (d) => d;
    this._softParentConnectionHandlers = [];
  }
};
var CreateDragNodeHierarchy = class CreateDragNodeHierarchy2 {
  _injector = inject(Injector);
  handle({
    nodesAndGroups
  }) {
    const handlerByNodeId = this._createHandlerByNodeId(nodesAndGroups);
    const rootHandlers = this._linkParentsAndCollectRoots(nodesAndGroups, handlerByNodeId);
    return new DragNodeHierarchy(rootHandlers, Array.from(handlerByNodeId.values()));
  }
  _createHandlerByNodeId(nodesAndGroups) {
    const result = /* @__PURE__ */ new Map();
    for (const nodeOrGroup of nodesAndGroups) {
      result.set(nodeOrGroup.fId(), new DragNodeItemHandler(this._injector, nodeOrGroup));
    }
    return result;
  }
  _linkParentsAndCollectRoots(nodesAndGroups, handlerByNodeId) {
    const rootHandlers = [];
    for (const nodeOrGroup of nodesAndGroups) {
      const handler = handlerByNodeId.get(nodeOrGroup.fId());
      if (!handler) {
        continue;
      }
      const parentId = nodeOrGroup.fParentId();
      const parentHandler = parentId ? handlerByNodeId.get(parentId) : void 0;
      if (parentHandler) {
        parentHandler.children.push(handler);
      } else {
        rootHandlers.push(handler);
      }
    }
    return rootHandlers;
  }
  static ɵfac = function CreateDragNodeHierarchy_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CreateDragNodeHierarchy2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CreateDragNodeHierarchy2,
    factory: CreateDragNodeHierarchy2.ɵfac
  });
};
CreateDragNodeHierarchy = __decorate([FExecutionRegister(CreateDragNodeHierarchyRequest)], CreateDragNodeHierarchy);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CreateDragNodeHierarchy, [{
    type: Injectable
  }], null, null);
})();
var BuildDragNodeConstraintsRequest = class {
  nodeOrGroup;
  static fToken = Symbol("BuildDragNodeConstraintsRequest");
  constructor(nodeOrGroup) {
    this.nodeOrGroup = nodeOrGroup;
  }
};
var ReadNodeBoundsWithPaddingsRequest = class {
  nodeOrGroup;
  childrenPaddings;
  static fToken = Symbol("ReadNodeBoundsWithPaddingsRequest");
  constructor(nodeOrGroup, childrenPaddings) {
    this.nodeOrGroup = nodeOrGroup;
    this.childrenPaddings = childrenPaddings;
  }
};
var ReadNodeBoundsWithPaddingsResponse = class {
  nodeOrGroup;
  boundingRect;
  innerRect;
  paddings;
  constructor(nodeOrGroup, boundingRect, innerRect, paddings) {
    this.nodeOrGroup = nodeOrGroup;
    this.boundingRect = boundingRect;
    this.innerRect = innerRect;
    this.paddings = paddings;
  }
};
var ReadNodeBoundsWithPaddings = class ReadNodeBoundsWithPaddings2 {
  _mediator = inject(FMediator);
  handle({
    nodeOrGroup,
    childrenPaddings
  }) {
    const boundingRect = this._readBoundingRect(nodeOrGroup);
    const ownPaddings = this._readOwnPaddings(nodeOrGroup, boundingRect);
    const paddings = [ownPaddings[0] + childrenPaddings[0], ownPaddings[1] + childrenPaddings[1], ownPaddings[2] + childrenPaddings[2], ownPaddings[3] + childrenPaddings[3]];
    const innerRect = RectExtensions.initialize(boundingRect.x + paddings[0], boundingRect.y + paddings[1], boundingRect.width - paddings[0] - paddings[2], boundingRect.height - paddings[1] - paddings[3]);
    return new ReadNodeBoundsWithPaddingsResponse(nodeOrGroup, boundingRect, innerRect, paddings);
  }
  _readBoundingRect(nodeOrGroup) {
    return this._mediator.execute(new GetNormalizedElementRectRequest(nodeOrGroup.hostElement));
  }
  _readOwnPaddings(nodeOrGroup, rect) {
    return this._mediator.execute(new GetNodePaddingRequest(nodeOrGroup, rect));
  }
  static ɵfac = function ReadNodeBoundsWithPaddings_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ReadNodeBoundsWithPaddings2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ReadNodeBoundsWithPaddings2,
    factory: ReadNodeBoundsWithPaddings2.ɵfac
  });
};
ReadNodeBoundsWithPaddings = __decorate([FExecutionRegister(ReadNodeBoundsWithPaddingsRequest)], ReadNodeBoundsWithPaddings);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ReadNodeBoundsWithPaddings, [{
    type: Injectable
  }], null, null);
})();
var BuildDragNodeConstraints = class BuildDragNodeConstraints2 {
  _mediator = inject(FMediator);
  handle({
    nodeOrGroup
  }) {
    const currentRect = this._readCurrentRect(nodeOrGroup);
    const parents = this._readParentsChain(nodeOrGroup);
    return this._buildConstraints(parents, currentRect);
  }
  _readCurrentRect(nodeOrGroup) {
    return this._mediator.execute(new GetNormalizedElementRectRequest(nodeOrGroup.hostElement));
  }
  _readParentsChain(nodeOrGroup) {
    return this._mediator.execute(new GetParentNodesRequest(nodeOrGroup)) ?? [];
  }
  _buildConstraints(parents, childRect) {
    const soft = [];
    let hard = infinityMinMax();
    let childrenPaddings = [0, 0, 0, 0];
    for (const parent of parents) {
      const parentInfo = this._readParentBounds(parent, childrenPaddings);
      childrenPaddings = parentInfo.paddings;
      const limits = this._calculateDifference(parentInfo.innerRect, childRect);
      if (this._isAutoExpand(parent)) {
        soft.push(this._makeSoftLimit(parent, parentInfo.boundingRect, limits));
      } else {
        hard = limits;
        break;
      }
    }
    return {
      soft,
      hard
    };
  }
  _readParentBounds(parent, childrenPaddings) {
    return this._mediator.execute(new ReadNodeBoundsWithPaddingsRequest(parent, childrenPaddings));
  }
  _calculateDifference(parentRect, currentRect) {
    return {
      min: this._calculateMinimumDifference(parentRect, currentRect),
      max: this._calculateMaximumDifference(parentRect, currentRect)
    };
  }
  _calculateMinimumDifference(parentRect, currentRect) {
    return PointExtensions.initialize(parentRect.x - currentRect.x, parentRect.y - currentRect.y);
  }
  _calculateMaximumDifference(parentRect, currentRect) {
    return PointExtensions.initialize(parentRect.x + parentRect.width - (currentRect.x + currentRect.width), parentRect.y + parentRect.height - (currentRect.y + currentRect.height));
  }
  _isAutoExpand(nodeOrGroup) {
    return nodeOrGroup.fAutoExpandOnChildHit();
  }
  _makeSoftLimit(nodeOrGroup, boundingRect, limits) {
    return {
      nodeOrGroup,
      boundingRect,
      initialSize: nodeOrGroup._size,
      limits
    };
  }
  static ɵfac = function BuildDragNodeConstraints_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || BuildDragNodeConstraints2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: BuildDragNodeConstraints2,
    factory: BuildDragNodeConstraints2.ɵfac
  });
};
BuildDragNodeConstraints = __decorate([FExecutionRegister(BuildDragNodeConstraintsRequest)], BuildDragNodeConstraints);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BuildDragNodeConstraints, [{
    type: Injectable
  }], null, null);
})();
var CreateDragNodeHandlerRequest = class {
  rootHandlers;
  participants;
  static fToken = Symbol("CreateDragNodeHandlerRequest");
  constructor(rootHandlers, participants) {
    this.rootHandlers = rootHandlers;
    this.participants = participants;
  }
};
var AttachSoftParentConnectionDragHandlersToNodeRequest = class {
  dragHandler;
  constraints;
  handlerPool;
  static fToken = Symbol("AttachSoftParentConnectionDragHandlersToNodeRequest");
  constructor(dragHandler, constraints, handlerPool) {
    this.dragHandler = dragHandler;
    this.constraints = constraints;
    this.handlerPool = handlerPool;
  }
};
var DragNodeConnectionHandlerBase = class {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  _behaviour = inject(ConnectionBehaviourBuilder);
  _source;
  _target;
  _sourceRef;
  _targetRef;
  _sourceDelta = PointExtensions.initialize();
  _targetDelta = PointExtensions.initialize();
  connection;
  initialize(connection) {
    this.connection = connection;
    this._source = this._store.outputs.require(this.connection.fOutputId());
    this._target = this._store.inputs.require(this.connection.fInputId());
    this._sourceRef = this._readRectRef(this._source);
    this._targetRef = this._readRectRef(this._target);
  }
  setSourceDelta(delta) {
    this._sourceDelta = delta;
    this._mediator.execute(new SetFCacheConnectorRectRequest(this._source.fId(), this._source.kind, this._withDelta(this._sourceRef.rect, delta)));
  }
  setTargetDelta(delta) {
    this._targetDelta = delta;
    this._mediator.execute(new SetFCacheConnectorRectRequest(this._target.fId(), this._target.kind, this._withDelta(this._targetRef.rect, delta)));
  }
  redraw() {
    const line = this._buildLine();
    this.connection.setLine(line);
    this.connection.redraw();
  }
  _buildLine() {
    const sourceRect = RoundedRect.fromRoundedRect(this._sourceRef.rect).addPoint(this._sourceDelta);
    const targetRect = RoundedRect.fromRoundedRect(this._targetRef.rect).addPoint(this._targetDelta);
    return this._behaviour.handle(new ConnectionBehaviourBuilderRequest(sourceRect, targetRect, this.connection, this._sourceRef.connector.fConnectableSide, this._targetRef.connector.fConnectableSide, this._resolveRotationContext(this._sourceRef.connector), this._resolveRotationContext(this._targetRef.connector)));
  }
  _readRectRef(connector) {
    return this._mediator.execute(new GetConnectorRectReferenceRequest(connector));
  }
  _withDelta(rect, delta) {
    return RoundedRect.fromRoundedRect(rect).addPoint(delta);
  }
  _resolveRotationContext(connector) {
    return this._mediator.execute(new ResolveConnectionEndpointRotationContextRequest(connector));
  }
};
var DragNodeConnectionSourceHandler = class _DragNodeConnectionSourceHandler extends DragNodeConnectionHandlerBase {
  setSourceDelta(delta) {
    super.setSourceDelta(delta);
    super.redraw();
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵDragNodeConnectionSourceHandler_BaseFactory;
    return function DragNodeConnectionSourceHandler_Factory(__ngFactoryType__) {
      return (ɵDragNodeConnectionSourceHandler_BaseFactory || (ɵDragNodeConnectionSourceHandler_BaseFactory = ɵɵgetInheritedFactory(_DragNodeConnectionSourceHandler)))(__ngFactoryType__ || _DragNodeConnectionSourceHandler);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _DragNodeConnectionSourceHandler,
    factory: _DragNodeConnectionSourceHandler.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DragNodeConnectionSourceHandler, [{
    type: Injectable
  }], null, null);
})();
var DragNodeConnectionBothSidesHandler = class _DragNodeConnectionBothSidesHandler extends DragNodeConnectionHandlerBase {
  _sourceUpdated = false;
  _targetUpdated = false;
  setSourceDelta(delta) {
    super.setSourceDelta(delta);
    this._sourceUpdated = true;
    this._redrawIfReady();
  }
  setTargetDelta(delta) {
    super.setTargetDelta(delta);
    this._targetUpdated = true;
    this._redrawIfReady();
  }
  _redrawIfReady() {
    if (!this._sourceUpdated || !this._targetUpdated) {
      return;
    }
    this._sourceUpdated = false;
    this._targetUpdated = false;
    this.redraw();
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵDragNodeConnectionBothSidesHandler_BaseFactory;
    return function DragNodeConnectionBothSidesHandler_Factory(__ngFactoryType__) {
      return (ɵDragNodeConnectionBothSidesHandler_BaseFactory || (ɵDragNodeConnectionBothSidesHandler_BaseFactory = ɵɵgetInheritedFactory(_DragNodeConnectionBothSidesHandler)))(__ngFactoryType__ || _DragNodeConnectionBothSidesHandler);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _DragNodeConnectionBothSidesHandler,
    factory: _DragNodeConnectionBothSidesHandler.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DragNodeConnectionBothSidesHandler, [{
    type: Injectable
  }], null, null);
})();
var DragNodeConnectionTargetHandler = class _DragNodeConnectionTargetHandler extends DragNodeConnectionHandlerBase {
  setTargetDelta(delta) {
    super.setTargetDelta(delta);
    this.redraw();
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵDragNodeConnectionTargetHandler_BaseFactory;
    return function DragNodeConnectionTargetHandler_Factory(__ngFactoryType__) {
      return (ɵDragNodeConnectionTargetHandler_BaseFactory || (ɵDragNodeConnectionTargetHandler_BaseFactory = ɵɵgetInheritedFactory(_DragNodeConnectionTargetHandler)))(__ngFactoryType__ || _DragNodeConnectionTargetHandler);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _DragNodeConnectionTargetHandler,
    factory: _DragNodeConnectionTargetHandler.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DragNodeConnectionTargetHandler, [{
    type: Injectable
  }], null, null);
})();
var AttachSoftParentConnectionDragHandlersToNode = class AttachSoftParentConnectionDragHandlersToNode2 {
  _store = inject(FComponentsStore);
  _mediator = inject(FMediator);
  _dragInjector = inject(DragHandlerInjector);
  handle({
    dragHandler,
    constraints,
    handlerPool
  }) {
    const softParentsHandlers = constraints.soft.map((x) => this._buildParentConnectionHandlers(x.nodeOrGroup, handlerPool));
    dragHandler.setSoftParentConnectionHandlers(softParentsHandlers);
  }
  _buildParentConnectionHandlers(parent, handlerPool) {
    const outputConnectors = this._store.outputs.getAll().filter((x) => x.fNodeId === parent.fId());
    const inputConnectors = this._store.inputs.getAll().filter((x) => x.fNodeId === parent.fId());
    if (!outputConnectors.length && !inputConnectors.length) {
      return {
        source: [],
        target: []
      };
    }
    const outputIds = new Set(outputConnectors.map((x) => x.fId()));
    const inputIds = new Set(inputConnectors.map((x) => x.fId()));
    const baselineRectByConnectorId = /* @__PURE__ */ new Map();
    const result = {
      source: [],
      target: []
    };
    for (const connection of this._store.connections.getAll()) {
      const isSource = outputIds.has(connection.fOutputId());
      const isTarget = inputIds.has(connection.fInputId());
      if (!isSource && !isTarget) {
        continue;
      }
      let connectionHandler = this._getExistingConnectionHandler(handlerPool, connection);
      if (!connectionHandler) {
        connectionHandler = this._createConnectionHandler(connection, isSource, isTarget);
        handlerPool.push(connectionHandler);
      }
      if (isSource) {
        const sourceConnector = this._store.outputs.require(connection.fOutputId());
        result.source.push({
          handler: connectionHandler,
          connector: sourceConnector,
          baselineRect: this._readConnectorRect(sourceConnector, baselineRectByConnectorId)
        });
      }
      if (isTarget) {
        const targetConnector = this._store.inputs.require(connection.fInputId());
        result.target.push({
          handler: connectionHandler,
          connector: targetConnector,
          baselineRect: this._readConnectorRect(targetConnector, baselineRectByConnectorId)
        });
      }
    }
    return result;
  }
  _getExistingConnectionHandler(existingConnectionHandlers, connection) {
    return existingConnectionHandlers.find((x) => x.connection.fId() === connection.fId());
  }
  _createConnectionHandler(connection, isSource, isTarget) {
    let result;
    if (isSource && isTarget) {
      result = this._dragInjector.createInstance(DragNodeConnectionBothSidesHandler);
    } else if (isSource) {
      result = this._dragInjector.createInstance(DragNodeConnectionSourceHandler);
    } else {
      result = this._dragInjector.createInstance(DragNodeConnectionTargetHandler);
    }
    result.initialize(connection);
    return result;
  }
  _readConnectorRect(connector, cache) {
    const cacheKey = `${connector.kind}::${connector.fId()}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    const rect = this._mediator.execute(new GetConnectorRectReferenceRequest(connector)).rect;
    cache.set(cacheKey, rect);
    return rect;
  }
  static ɵfac = function AttachSoftParentConnectionDragHandlersToNode_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || AttachSoftParentConnectionDragHandlersToNode2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: AttachSoftParentConnectionDragHandlersToNode2,
    factory: AttachSoftParentConnectionDragHandlersToNode2.ɵfac
  });
};
AttachSoftParentConnectionDragHandlersToNode = __decorate([FExecutionRegister(AttachSoftParentConnectionDragHandlersToNodeRequest)], AttachSoftParentConnectionDragHandlersToNode);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AttachSoftParentConnectionDragHandlersToNode, [{
    type: Injectable
  }], null, null);
})();
var CreateDragNodeHandler = class CreateDragNodeHandler2 {
  _dragInjector = inject(DragHandlerInjector);
  _mediator = inject(FMediator);
  handle({
    rootHandlers,
    participants
  }) {
    const handlerPool = this._collectConnectionHandlers(participants);
    this._applyConstraintsToRoots(rootHandlers, handlerPool);
    const handler = this._dragInjector.createInstance(DragNodeHandler);
    handler.initialize(participants, rootHandlers);
    return handler;
  }
  _applyConstraintsToRoots(roots, handlerPool) {
    for (const handler of roots) {
      const constraints = this._calculateConstraints(handler.nodeOrGroup);
      handler.setConstraints(constraints);
      this._attachSoftParentConnectionHandlers(handler, constraints, handlerPool);
    }
  }
  _collectConnectionHandlers(participants) {
    const result = /* @__PURE__ */ new Map();
    for (const participant of participants) {
      for (const handler of participant.sourceConnectionHandlers) {
        result.set(handler.connection.fId(), handler);
      }
      for (const handler of participant.targetConnectionHandlers) {
        result.set(handler.connection.fId(), handler);
      }
    }
    return Array.from(result.values());
  }
  _attachSoftParentConnectionHandlers(dragHandler, constraints, handlerPool) {
    this._mediator.execute(new AttachSoftParentConnectionDragHandlersToNodeRequest(dragHandler, constraints, handlerPool));
  }
  _calculateConstraints(nodeOrGroup) {
    return this._mediator.execute(new BuildDragNodeConstraintsRequest(nodeOrGroup));
  }
  static ɵfac = function CreateDragNodeHandler_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CreateDragNodeHandler2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CreateDragNodeHandler2,
    factory: CreateDragNodeHandler2.ɵfac
  });
};
CreateDragNodeHandler = __decorate([FExecutionRegister(CreateDragNodeHandlerRequest)], CreateDragNodeHandler);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CreateDragNodeHandler, [{
    type: Injectable
  }], null, null);
})();
var AttachTargetConnectionDragHandlersToNodeRequest = class {
  dragHandler;
  sourceIds;
  handlerPool;
  static fToken = Symbol("AttachTargetConnectionDragHandlersToNodeRequest");
  constructor(dragHandler, sourceIds, handlerPool) {
    this.dragHandler = dragHandler;
    this.sourceIds = sourceIds;
    this.handlerPool = handlerPool;
  }
};
var AttachTargetConnectionDragHandlersToNode = class AttachTargetConnectionDragHandlersToNode2 {
  _store = inject(FComponentsStore);
  _dragInjector = inject(DragHandlerInjector);
  get _connections() {
    return this._store.connections.getAll();
  }
  handle(request) {
    this._getInputConnections(request.dragHandler.nodeOrGroup).forEach((connection) => {
      this._createAndSetConnectionToNodeHandler(connection, request);
    });
  }
  _getInputConnections(nodeOrGroup) {
    const ids = new Set(this._getNodeInputIds(nodeOrGroup));
    return this._connections.filter((x) => ids.has(x.fInputId()));
  }
  _getNodeInputIds(nodeOrGroup) {
    return this._store.inputs.getAll().filter((x) => nodeOrGroup.isContains(x.hostElement)).map((x) => x.fId());
  }
  _createAndSetConnectionToNodeHandler(connection, request) {
    let connectionHandler = this._getExistingConnectionHandler(request.handlerPool, connection);
    if (!connectionHandler) {
      connectionHandler = this._createConnectionHandler(request.sourceIds, connection);
      request.handlerPool.push(connectionHandler);
    }
    request.dragHandler.targetConnectionHandlers.push(connectionHandler);
  }
  _getExistingConnectionHandler(existingConnectionHandlers, connection) {
    return existingConnectionHandlers.find((x) => x.connection.fId() === connection.fId());
  }
  _createConnectionHandler(outputIds, connection) {
    let result;
    if (outputIds.includes(connection.fOutputId())) {
      result = this._dragInjector.createInstance(DragNodeConnectionBothSidesHandler);
    } else {
      result = this._dragInjector.createInstance(DragNodeConnectionTargetHandler);
    }
    result.initialize(connection);
    return result;
  }
  static ɵfac = function AttachTargetConnectionDragHandlersToNode_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || AttachTargetConnectionDragHandlersToNode2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: AttachTargetConnectionDragHandlersToNode2,
    factory: AttachTargetConnectionDragHandlersToNode2.ɵfac
  });
};
AttachTargetConnectionDragHandlersToNode = __decorate([FExecutionRegister(AttachTargetConnectionDragHandlersToNodeRequest)], AttachTargetConnectionDragHandlersToNode);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AttachTargetConnectionDragHandlersToNode, [{
    type: Injectable
  }], null, null);
})();
var AttachSourceConnectionDragHandlersToNodeRequest = class {
  dragHandler;
  targetIds;
  handlerPool;
  static fToken = Symbol("AttachSourceConnectionDragHandlersToNodeRequest");
  constructor(dragHandler, targetIds, handlerPool) {
    this.dragHandler = dragHandler;
    this.targetIds = targetIds;
    this.handlerPool = handlerPool;
  }
};
var AttachSourceConnectionDragHandlersToNode = class AttachSourceConnectionDragHandlersToNode2 {
  _store = inject(FComponentsStore);
  _dragInjector = inject(DragHandlerInjector);
  get _connections() {
    return this._store.connections.getAll();
  }
  handle(request) {
    this._getOutputConnections(request.dragHandler.nodeOrGroup).forEach((fConnection) => {
      this._createAndSetConnectionToNodeHandler(fConnection, request);
    });
  }
  _getOutputConnections(nodeOrGroup) {
    const ids = new Set(this._getNodeOutputIds(nodeOrGroup));
    return this._connections.filter((x) => ids.has(x.fOutputId()));
  }
  _getNodeOutputIds(nodeOrGroup) {
    return this._store.outputs.getAll().filter((x) => nodeOrGroup.isContains(x.hostElement)).map((x) => x.fId());
  }
  _createAndSetConnectionToNodeHandler(connection, request) {
    let connectionHandler = this._getExistingConnectionHandler(request.handlerPool, connection);
    if (!connectionHandler) {
      connectionHandler = this._createConnectionHandler(request.targetIds, connection);
      request.handlerPool.push(connectionHandler);
    }
    request.dragHandler.sourceConnectionHandlers.push(connectionHandler);
  }
  _getExistingConnectionHandler(existingConnectionHandlers, connection) {
    return existingConnectionHandlers.find((x) => x.connection.fId() === connection.fId());
  }
  _createConnectionHandler(inputIds, connection) {
    let result;
    if (inputIds.includes(connection.fInputId())) {
      result = this._dragInjector.createInstance(DragNodeConnectionBothSidesHandler);
    } else {
      result = this._dragInjector.createInstance(DragNodeConnectionSourceHandler);
    }
    result.initialize(connection);
    return result;
  }
  static ɵfac = function AttachSourceConnectionDragHandlersToNode_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || AttachSourceConnectionDragHandlersToNode2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: AttachSourceConnectionDragHandlersToNode2,
    factory: AttachSourceConnectionDragHandlersToNode2.ɵfac
  });
};
AttachSourceConnectionDragHandlersToNode = __decorate([FExecutionRegister(AttachSourceConnectionDragHandlersToNodeRequest)], AttachSourceConnectionDragHandlersToNode);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AttachSourceConnectionDragHandlersToNode, [{
    type: Injectable
  }], null, null);
})();
var AttachDragNodeHandlerFromSelectionRequest = class {
  nodeOrGroup;
  static fToken = Symbol("AttachDragNodeHandlerFromSelectionRequest");
  constructor(nodeOrGroup) {
    this.nodeOrGroup = nodeOrGroup;
  }
};
var AttachDragNodeHandlerFromSelection = class AttachDragNodeHandlerFromSelection2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  _dragSession = inject(FDraggableDataContext);
  handle({
    nodeOrGroup
  }) {
    const selected = this._collectSelected(nodeOrGroup);
    const selectedWithChildren = this._withDeepChildren(selected);
    const hierarchy = this._mediator.execute(new CreateDragNodeHierarchyRequest(selectedWithChildren));
    const selectedSourceConnectorIds = this._collectSourceConnectorIds(selectedWithChildren);
    const selectedTargetConnectorIds = this._collectTargetConnectorIds(selectedWithChildren);
    this._attachConnectionHandlers(hierarchy.participants, selectedSourceConnectorIds, selectedTargetConnectorIds);
    return this._mediator.execute(new CreateDragNodeHandlerRequest(hierarchy.rootHandlers, hierarchy.participants));
  }
  _collectSelected(nodeOrGroup) {
    const result = [];
    for (const item of this._dragSession.selectedItems) {
      const node = this._findNodeByHost(item.hostElement);
      if (node) {
        result.push(node);
      }
    }
    if (nodeOrGroup && !result.includes(nodeOrGroup)) {
      result.push(nodeOrGroup);
    }
    return result;
  }
  _findNodeByHost(host) {
    return this._store.nodes.getAll().find((x) => x.isContains(host));
  }
  _withDeepChildren(nodes) {
    const result = [];
    for (const node of nodes) {
      result.push(node);
      const children = this._mediator.execute(new GetDeepChildrenNodesAndGroupsRequest(node.fId()));
      result.push(...children);
    }
    return result;
  }
  _collectSourceConnectorIds(nodes) {
    return flatMap(nodes, (n) => this._store.outputs.getAll().filter((x) => x.fNodeId === n.fId()).map((x) => x.fId()));
  }
  _collectTargetConnectorIds(nodes) {
    return flatMap(nodes, (n) => this._store.inputs.getAll().filter((x) => x.fNodeId === n.fId()).map((x) => x.fId()));
  }
  _attachConnectionHandlers(participants, selectedSourceConnectorIds, selectedTargetConnectorIds) {
    const handlerPool = [];
    for (const handler of participants) {
      this._mediator.execute(new AttachSourceConnectionDragHandlersToNodeRequest(handler, selectedTargetConnectorIds, handlerPool));
      this._mediator.execute(new AttachTargetConnectionDragHandlersToNodeRequest(handler, selectedSourceConnectorIds, handlerPool));
    }
  }
  static ɵfac = function AttachDragNodeHandlerFromSelection_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || AttachDragNodeHandlerFromSelection2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: AttachDragNodeHandlerFromSelection2,
    factory: AttachDragNodeHandlerFromSelection2.ɵfac
  });
};
AttachDragNodeHandlerFromSelection = __decorate([FExecutionRegister(AttachDragNodeHandlerFromSelectionRequest)], AttachDragNodeHandlerFromSelection);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AttachDragNodeHandlerFromSelection, [{
    type: Injectable
  }], null, null);
})();
var CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS = [CreateDragNodeHierarchy, BuildDragNodeConstraints, CreateDragNodeHandler, AttachTargetConnectionDragHandlersToNode, AttachSourceConnectionDragHandlersToNode, AttachSoftParentConnectionDragHandlersToNode, ReadNodeBoundsWithPaddings, AttachDragNodeHandlerFromSelection];
function calculateMagneticGuides(elements, target, alignThreshold = 10) {
  const tx = target.x;
  const ty = target.y;
  const tr = tx + target.width;
  const tb = ty + target.height;
  const tcx = target.gravityCenter.x;
  const tcy = target.gravityCenter.y;
  let bestXGuide;
  let bestXDelta;
  let bestXAbs = Infinity;
  let bestYGuide;
  let bestYDelta;
  let bestYAbs = Infinity;
  const considerX = (guide, delta) => {
    const abs = delta < 0 ? -delta : delta;
    if (abs <= alignThreshold && abs < bestXAbs) {
      bestXAbs = abs;
      bestXGuide = guide;
      bestXDelta = delta;
    }
  };
  const considerY = (guide, delta) => {
    const abs = delta < 0 ? -delta : delta;
    if (abs <= alignThreshold && abs < bestYAbs) {
      bestYAbs = abs;
      bestYGuide = guide;
      bestYDelta = delta;
    }
  };
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    const ex = el.x;
    const ey = el.y;
    const er = ex + el.width;
    const eb = ey + el.height;
    const ecx = el.gravityCenter.x;
    const ecy = el.gravityCenter.y;
    considerX(ex, tx - ex);
    considerX(er, tx - er);
    considerX(ecx, tcx - ecx);
    considerX(ex, tr - ex);
    considerX(er, tr - er);
    considerY(ey, ty - ey);
    considerY(eb, ty - eb);
    considerY(ecy, tcy - ecy);
    considerY(ey, tb - ey);
    considerY(eb, tb - eb);
  }
  return {
    x: {
      guide: bestXGuide,
      delta: bestXDelta
    },
    y: {
      guide: bestYGuide,
      delta: bestYDelta
    }
  };
}
var MAGNETIC_LINE_RECT_KEYS = ["left", "top", "width", "height"];
var MagneticLineElement = class {
  _element;
  constructor(browser, hostElement, className = "f-line") {
    this._element = browser.document.createElement("div");
    this._element.classList.add(className);
    this._element.style.position = "absolute";
    this._element.style.display = "none";
    hostElement.appendChild(this._element);
  }
  show() {
    this._element.style.display = "block";
  }
  hide() {
    this._element.style.display = "none";
  }
  render(rect) {
    for (const key of MAGNETIC_LINE_RECT_KEYS) {
      const value = rect[key];
      if (value != null) {
        this._element.style[key] = `${value}px`;
      }
    }
  }
  clearRect() {
    for (const key of MAGNETIC_LINE_RECT_KEYS) {
      this._element.style.removeProperty(key);
    }
  }
  destroy() {
    this._element.remove();
  }
};
var MagneticLineRenderer = class {
  _horizontal;
  _vertical;
  constructor(browser, hostElement) {
    this._horizontal = new MagneticLineElement(browser, hostElement);
    this._vertical = new MagneticLineElement(browser, hostElement);
    this._horizontal.hide();
    this._vertical.hide();
  }
  drawVerticalLine(x, size, transform) {
    this._vertical.show();
    this._vertical.render({
      left: x * transform.scale + transform.position.x + transform.scaledPosition.x,
      top: 0,
      width: 1,
      height: size.height
    });
  }
  drawHorizontalLine(y, size, transform) {
    this._horizontal.show();
    this._horizontal.render({
      left: 0,
      top: y * transform.scale + transform.position.y + transform.scaledPosition.y,
      width: size.width,
      height: 1
    });
  }
  hideVertical() {
    this._vertical.hide();
  }
  hideHorizontal() {
    this._horizontal.hide();
  }
  hideAll() {
    this._vertical.hide();
    this._horizontal.hide();
  }
  destroy() {
    this._vertical.destroy();
    this._horizontal.destroy();
  }
};
var MagneticLinesPreparationRequest = class {
  static fToken = Symbol("MagneticLinesPreparationRequest");
};
var MagneticLinesPreparation = class MagneticLinesPreparation2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  _browser = inject(BrowserService);
  _injector = inject(Injector);
  _dragSession = inject(FDraggableDataContext);
  _renderer;
  handle(_) {
    const magneticLines = this._store.instances.get(INSTANCES.MAGNETIC_LINES);
    if (!magneticLines) {
      return;
    }
    const handler = this._dragSession.draggableItems.find((x) => x instanceof DragNodeHandler);
    if (!handler) {
      return;
    }
    handler.setMagneticLines(new MagneticLinesHandler(this._injector, this._renderer ?? this._createRenderer(magneticLines), this._flowHostSize(), this._notDraggedRects(this._draggedNodes(handler.items))));
  }
  _draggedNodes(items) {
    return items.map((x) => x.nodeOrGroup);
  }
  _flowHostSize() {
    return this._store.flowHost.getBoundingClientRect();
  }
  _createRenderer({
    hostElement
  }) {
    this._renderer = new MagneticLineRenderer(this._browser, hostElement);
    return this._renderer;
  }
  _notDraggedRects(draggedNodes) {
    const dragged = new Set(draggedNodes);
    const notDragged = this._store.nodes.getAll().filter((x) => !dragged.has(x));
    return notDragged.map((x) => this._mediator.execute(new GetNormalizedElementRectRequest(x.hostElement)));
  }
  static ɵfac = function MagneticLinesPreparation_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || MagneticLinesPreparation2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: MagneticLinesPreparation2,
    factory: MagneticLinesPreparation2.ɵfac
  });
};
MagneticLinesPreparation = __decorate([FExecutionRegister(MagneticLinesPreparationRequest)], MagneticLinesPreparation);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MagneticLinesPreparation, [{
    type: Injectable
  }], null, null);
})();
var MagneticLinesHandler = class {
  _renderer;
  _size;
  _rects;
  _timerId = null;
  _canvasTransform;
  _alignThreshold = 10;
  constructor(injector, _renderer, _size, _rects) {
    this._renderer = _renderer;
    this._size = _size;
    this._rects = _rects;
    const store = injector.get(FComponentsStore);
    this._alignThreshold = store.instances.require(INSTANCES.MAGNETIC_LINES).threshold();
    this._canvasTransform = store.transform;
  }
  scheduleRender(_draggedRect) {
    if (this._timerId) {
      clearTimeout(this._timerId);
    }
    this._timerId = setTimeout(() => this._renderGuides(this._computeGuides(_draggedRect)), 15);
  }
  _renderGuides(guides) {
    this._renderVertical(guides);
    this._renderHorizontal(guides);
  }
  _renderVertical(guides) {
    if (guides.x.guide !== void 0) {
      this._renderer.drawVerticalLine(guides.x.guide, this._size, this._canvasTransform);
    } else {
      this._renderer.hideVertical();
    }
  }
  _renderHorizontal(guides) {
    if (guides.y.guide !== void 0) {
      this._renderer.drawHorizontalLine(guides.y.guide, this._size, this._canvasTransform);
    } else {
      this._renderer.hideHorizontal();
    }
  }
  _computeGuides(_draggedRect) {
    return calculateMagneticGuides(this._rects, _draggedRect, this._alignThreshold);
  }
  clearGuides() {
    this._renderer.hideAll();
    if (this._timerId) {
      clearTimeout(this._timerId);
      this._timerId = null;
    }
  }
};
var AXIS_X_ALIGN_MODES = ["top", "center", "bottom"];
var AXIS_Y_ALIGN_MODES = ["left", "center", "right"];
function calculateMagneticRects(elements, target, alignThreshold = 10, spacingThreshold = 10) {
  const tx = target.x;
  const ty = target.y;
  const tr = tx + target.width;
  const tb = ty + target.height;
  const tcx = target.gravityCenter.x;
  const tcy = target.gravityCenter.y;
  const xCandidate = _calculateAxisX_FigmaLike(elements, target, tx, ty, tr, tb, tcx, tcy, alignThreshold, spacingThreshold);
  const yCandidate = _calculateAxisY_FigmaLike(elements, target, tx, ty, tr, tb, tcx, tcy, alignThreshold, spacingThreshold);
  if (xCandidate && (!yCandidate || xCandidate.absDelta <= yCandidate.absDelta)) {
    return {
      axis: "x",
      delta: xCandidate.delta,
      gap: xCandidate.gap,
      rects: xCandidate.rects,
      alignMode: xCandidate.alignMode,
      crossDelta: xCandidate.crossDelta
    };
  }
  if (yCandidate) {
    return {
      axis: "y",
      delta: yCandidate.delta,
      gap: yCandidate.gap,
      rects: yCandidate.rects,
      alignMode: yCandidate.alignMode,
      crossDelta: yCandidate.crossDelta
    };
  }
  return {
    rects: []
  };
}
function _calculateAxisX_FigmaLike(elements, target, tx, ty, _tr, tb, tcx, tcy, alignThreshold, spacingThreshold) {
  let bestAbs = Infinity;
  let bestDelta;
  let bestGap = 0;
  let bestAlignMode;
  let bestRects = [];
  let bestCrossDelta = 0;
  const indices = [];
  const starts = [];
  const ends = [];
  for (let modeIndex = 0; modeIndex < AXIS_X_ALIGN_MODES.length; modeIndex++) {
    const targetAnchor = modeIndex === 0 ? ty : modeIndex === 1 ? tcy : tb;
    indices.length = 0;
    starts.length = 0;
    ends.length = 0;
    let bandTop = Infinity;
    let bandBottom = -Infinity;
    let guideAnchor = 0;
    let guideAbs = Infinity;
    let guideElementIndex = Infinity;
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const elAnchor = modeIndex === 0 ? el.y : modeIndex === 1 ? el.gravityCenter.y : el.y + el.height;
      const alignDelta = targetAnchor - elAnchor;
      const alignAbs = _abs(alignDelta);
      if (alignAbs > alignThreshold) continue;
      indices.push(i);
      starts.push(el.x);
      ends.push(el.x + el.width);
      const top = el.y;
      const bottom = el.y + el.height;
      if (top < bandTop) bandTop = top;
      if (bottom > bandBottom) bandBottom = bottom;
      if (alignAbs < guideAbs || alignAbs === guideAbs && i < guideElementIndex) {
        guideAbs = alignAbs;
        guideAnchor = elAnchor;
        guideElementIndex = i;
      }
    }
    const count = indices.length;
    if (count < 2) continue;
    _stableSortByStart(indices, starts, ends);
    let insertion = 0;
    while (insertion < count && starts[insertion] <= tcx) insertion++;
    const between = insertion > 0 && insertion < count;
    let leftIndex;
    let rightIndex;
    if (between) {
      leftIndex = insertion - 1;
      rightIndex = insertion;
    } else if (insertion <= 0) {
      leftIndex = 0;
      rightIndex = 1;
    } else {
      leftIndex = count - 2;
      rightIndex = count - 1;
    }
    const g = starts[rightIndex] - ends[leftIndex];
    if (g < 0) continue;
    let desiredLeft;
    if (between) {
      desiredLeft = ends[leftIndex] + g;
      const desiredRight = desiredLeft + target.width;
      const rightGap = starts[rightIndex] - desiredRight;
      if (_abs(rightGap - g) > spacingThreshold) continue;
    } else if (insertion <= 0) {
      desiredLeft = starts[0] - g - target.width;
    } else {
      desiredLeft = ends[count - 1] + g;
    }
    const delta = tx - desiredLeft;
    const absDelta = _abs(delta);
    if (absDelta > spacingThreshold) continue;
    if (absDelta >= bestAbs) continue;
    const rects = _buildGapRectsXWithBand(indices, starts, ends, bandTop, bandBottom);
    if (between) {
      const snappedLeft = desiredLeft;
      const snappedRight = desiredLeft + target.width;
      rects.push({
        left: ends[leftIndex],
        top: bandTop,
        width: snappedLeft - ends[leftIndex],
        height: bandBottom - bandTop
      });
      rects.push({
        left: snappedRight,
        top: bandTop,
        width: starts[rightIndex] - snappedRight,
        height: bandBottom - bandTop
      });
    } else if (insertion <= 0) {
      const snappedRight = desiredLeft + target.width;
      rects.push({
        left: snappedRight,
        top: bandTop,
        width: starts[0] - snappedRight,
        height: bandBottom - bandTop
      });
    } else {
      rects.push({
        left: ends[count - 1],
        top: bandTop,
        width: desiredLeft - ends[count - 1],
        height: bandBottom - bandTop
      });
    }
    const crossDelta = targetAnchor - guideAnchor;
    bestAbs = absDelta;
    bestDelta = delta;
    bestGap = g;
    bestAlignMode = AXIS_X_ALIGN_MODES[modeIndex];
    bestRects = rects;
    bestCrossDelta = crossDelta;
  }
  if (bestDelta === void 0 || bestAlignMode === void 0) return void 0;
  return {
    delta: bestDelta,
    absDelta: bestAbs,
    gap: bestGap,
    rects: bestRects,
    alignMode: bestAlignMode,
    crossDelta: bestCrossDelta
  };
}
function _calculateAxisY_FigmaLike(elements, target, tx, ty, tr, _tb, tcx, tcy, alignThreshold, spacingThreshold) {
  let bestAbs = Infinity;
  let bestDelta;
  let bestGap = 0;
  let bestAlignMode;
  let bestRects = [];
  let bestCrossDelta = 0;
  const indices = [];
  const starts = [];
  const ends = [];
  for (let modeIndex = 0; modeIndex < AXIS_Y_ALIGN_MODES.length; modeIndex++) {
    const targetAnchor = modeIndex === 0 ? tx : modeIndex === 1 ? tcx : tr;
    indices.length = 0;
    starts.length = 0;
    ends.length = 0;
    let bandLeft = Infinity;
    let bandRight = -Infinity;
    let guideAnchor = 0;
    let guideAbs = Infinity;
    let guideElementIndex = Infinity;
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const elAnchor = modeIndex === 0 ? el.x : modeIndex === 1 ? el.gravityCenter.x : el.x + el.width;
      const alignDelta = targetAnchor - elAnchor;
      const alignAbs = _abs(alignDelta);
      if (alignAbs > alignThreshold) continue;
      indices.push(i);
      starts.push(el.y);
      ends.push(el.y + el.height);
      const left = el.x;
      const right = el.x + el.width;
      if (left < bandLeft) bandLeft = left;
      if (right > bandRight) bandRight = right;
      if (alignAbs < guideAbs || alignAbs === guideAbs && i < guideElementIndex) {
        guideAbs = alignAbs;
        guideAnchor = elAnchor;
        guideElementIndex = i;
      }
    }
    const count = indices.length;
    if (count < 2) continue;
    _stableSortByStart(indices, starts, ends);
    let insertion = 0;
    while (insertion < count && starts[insertion] <= tcy) insertion++;
    const between = insertion > 0 && insertion < count;
    let topIndex;
    let bottomIndex;
    if (between) {
      topIndex = insertion - 1;
      bottomIndex = insertion;
    } else if (insertion <= 0) {
      topIndex = 0;
      bottomIndex = 1;
    } else {
      topIndex = count - 2;
      bottomIndex = count - 1;
    }
    const g = starts[bottomIndex] - ends[topIndex];
    if (g < 0) continue;
    let desiredTop;
    if (between) {
      desiredTop = ends[topIndex] + g;
      const desiredBottom = desiredTop + target.height;
      const bottomGap = starts[bottomIndex] - desiredBottom;
      if (_abs(bottomGap - g) > spacingThreshold) continue;
    } else if (insertion <= 0) {
      desiredTop = starts[0] - g - target.height;
    } else {
      desiredTop = ends[count - 1] + g;
    }
    const delta = ty - desiredTop;
    const absDelta = _abs(delta);
    if (absDelta > spacingThreshold) continue;
    if (absDelta >= bestAbs) continue;
    const rects = _buildGapRectsYWithBand(indices, starts, ends, bandLeft, bandRight);
    if (between) {
      const snappedTop = desiredTop;
      const snappedBottom = desiredTop + target.height;
      rects.push({
        left: bandLeft,
        top: ends[topIndex],
        width: bandRight - bandLeft,
        height: snappedTop - ends[topIndex]
      });
      rects.push({
        left: bandLeft,
        top: snappedBottom,
        width: bandRight - bandLeft,
        height: starts[bottomIndex] - snappedBottom
      });
    } else if (insertion <= 0) {
      const snappedBottom = desiredTop + target.height;
      rects.push({
        left: bandLeft,
        top: snappedBottom,
        width: bandRight - bandLeft,
        height: starts[0] - snappedBottom
      });
    } else {
      rects.push({
        left: bandLeft,
        top: ends[count - 1],
        width: bandRight - bandLeft,
        height: desiredTop - ends[count - 1]
      });
    }
    const crossDelta = targetAnchor - guideAnchor;
    bestAbs = absDelta;
    bestDelta = delta;
    bestGap = g;
    bestAlignMode = AXIS_Y_ALIGN_MODES[modeIndex];
    bestRects = rects;
    bestCrossDelta = crossDelta;
  }
  if (bestDelta === void 0 || bestAlignMode === void 0) return void 0;
  return {
    delta: bestDelta,
    absDelta: bestAbs,
    gap: bestGap,
    rects: bestRects,
    alignMode: bestAlignMode,
    crossDelta: bestCrossDelta
  };
}
function _buildGapRectsXWithBand(indices, starts, ends, bandTop, bandBottom) {
  const rects = [];
  const height = bandBottom - bandTop;
  for (let i = 0; i < indices.length - 1; i++) {
    const gap = starts[i + 1] - ends[i];
    if (gap < 0) continue;
    rects.push({
      left: ends[i],
      top: bandTop,
      width: gap,
      height
    });
  }
  return rects;
}
function _buildGapRectsYWithBand(indices, starts, ends, bandLeft, bandRight) {
  const rects = [];
  const width = bandRight - bandLeft;
  for (let i = 0; i < indices.length - 1; i++) {
    const gap = starts[i + 1] - ends[i];
    if (gap < 0) continue;
    rects.push({
      left: bandLeft,
      top: ends[i],
      width,
      height: gap
    });
  }
  return rects;
}
function _stableSortByStart(indices, starts, ends) {
  for (let i = 1; i < starts.length; i++) {
    const start = starts[i];
    const end = ends[i];
    const index = indices[i];
    let j = i - 1;
    while (j >= 0) {
      const prevStart = starts[j];
      const prevIndex = indices[j];
      const shouldStop = prevStart < start || prevStart === start && prevIndex < index;
      if (shouldStop) break;
      starts[j + 1] = prevStart;
      ends[j + 1] = ends[j];
      indices[j + 1] = prevIndex;
      j--;
    }
    starts[j + 1] = start;
    ends[j + 1] = end;
    indices[j + 1] = index;
  }
}
function _abs(v) {
  return v < 0 ? -v : v;
}
var MagneticRectElement = class {
  _element;
  _isVisible = false;
  _left = Number.NaN;
  _top = Number.NaN;
  _width = Number.NaN;
  _height = Number.NaN;
  constructor(browser, hostElement, className = "f-rect") {
    this._element = browser.document.createElement("div");
    this._element.classList.add(className);
    const style = this._element.style;
    style.position = "absolute";
    style.display = "none";
    style.boxSizing = "border-box";
    style.pointerEvents = "none";
    hostElement.appendChild(this._element);
  }
  show() {
    if (this._isVisible) {
      return;
    }
    this._isVisible = true;
    this._element.style.display = "block";
  }
  hide() {
    if (!this._isVisible) {
      return;
    }
    this._isVisible = false;
    this._element.style.display = "none";
  }
  render(left, top, width, height) {
    const style = this._element.style;
    if (left !== this._left) {
      this._left = left;
      style.left = left + "px";
    }
    if (top !== this._top) {
      this._top = top;
      style.top = top + "px";
    }
    if (width !== this._width) {
      this._width = width;
      style.width = width + "px";
    }
    if (height !== this._height) {
      this._height = height;
      style.height = height + "px";
    }
  }
  clearRect() {
    this._left = Number.NaN;
    this._top = Number.NaN;
    this._width = Number.NaN;
    this._height = Number.NaN;
    const style = this._element.style;
    style.removeProperty("left");
    style.removeProperty("top");
    style.removeProperty("width");
    style.removeProperty("height");
  }
  destroy() {
    this._element.remove();
  }
};
var MagneticRectsRenderer = class {
  _browser;
  _hostElement;
  _className;
  _pool = [];
  _activeCount = 0;
  constructor(_browser, _hostElement, _className = "f-rect") {
    this._browser = _browser;
    this._hostElement = _hostElement;
    this._className = _className;
  }
  draw(rects, transform) {
    const scale = transform.scale;
    const offsetX = transform.position.x + transform.scaledPosition.x;
    const offsetY = transform.position.y + transform.scaledPosition.y;
    for (let i = 0; i < rects.length; i++) {
      const magneticRect = this._getOrCreate(i);
      const rect = rects[i];
      magneticRect.show();
      magneticRect.render(rect.left * scale + offsetX, rect.top * scale + offsetY, rect.width * scale, rect.height * scale);
    }
    for (let i = rects.length; i < this._activeCount; i++) {
      this._pool[i].hide();
    }
    this._activeCount = rects.length;
  }
  hideAll() {
    for (let i = 0; i < this._activeCount; i++) {
      this._pool[i].hide();
    }
    this._activeCount = 0;
  }
  destroy() {
    for (const item of this._pool) {
      item.destroy();
    }
    this._pool.length = 0;
    this._activeCount = 0;
  }
  _getOrCreate(index) {
    if (index < this._pool.length) {
      return this._pool[index];
    }
    const item = new MagneticRectElement(this._browser, this._hostElement, this._className);
    this._pool.push(item);
    return item;
  }
};
var MagneticRectsPreparationRequest = class {
  static fToken = Symbol("MagneticRectsPreparationRequest");
};
var MagneticRectsPreparation = class MagneticRectsPreparation2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  _browser = inject(BrowserService);
  _injector = inject(Injector);
  _dragSession = inject(FDraggableDataContext);
  _renderer;
  handle(_) {
    const magneticRects = this._store.instances.get(INSTANCES.MAGNETIC_RECTS);
    if (!magneticRects) {
      return;
    }
    const handler = this._dragSession.draggableItems.find((x) => x instanceof DragNodeHandler);
    if (!handler) {
      return;
    }
    handler.setMagneticRects(new MagneticRectsHandler(this._injector, this._getRenderer(magneticRects), this._notDraggedRects(this._draggedNodes(handler.items))));
  }
  _draggedNodes(items) {
    return items.map((x) => x.nodeOrGroup);
  }
  _getRenderer(instance) {
    if (!this._renderer) {
      this._renderer = new MagneticRectsRenderer(this._browser, instance.hostElement);
    }
    this._renderer?.destroy();
    return this._renderer;
  }
  _notDraggedRects(draggedNodes) {
    const dragged = new Set(draggedNodes);
    const notDragged = this._store.nodes.getAll().filter((x) => !dragged.has(x));
    return notDragged.map((x) => this._mediator.execute(new GetNormalizedElementRectRequest(x.hostElement)));
  }
  static ɵfac = function MagneticRectsPreparation_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || MagneticRectsPreparation2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: MagneticRectsPreparation2,
    factory: MagneticRectsPreparation2.ɵfac
  });
};
MagneticRectsPreparation = __decorate([FExecutionRegister(MagneticRectsPreparationRequest)], MagneticRectsPreparation);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MagneticRectsPreparation, [{
    type: Injectable
  }], null, null);
})();
var MagneticRectsHandler = class {
  _renderer;
  _rects;
  _timerId = null;
  _canvasTransform;
  _alignThreshold = 10;
  _spacingThreshold = 10;
  constructor(injector, _renderer, _rects) {
    this._renderer = _renderer;
    this._rects = _rects;
    const store = injector.get(FComponentsStore);
    const magneticRects = store.instances.require(INSTANCES.MAGNETIC_RECTS);
    this._alignThreshold = magneticRects.alignThreshold();
    this._spacingThreshold = magneticRects.spacingThreshold();
    this._canvasTransform = store.transform;
  }
  scheduleRender(_draggedRect) {
    if (this._timerId) {
      clearTimeout(this._timerId);
    }
    this._timerId = setTimeout(() => this._renderRects(this._computeRects(_draggedRect)), 15);
  }
  _renderRects(result) {
    if (result.axis !== void 0 && result.delta !== void 0 && result.rects.length > 0) {
      this._renderer.draw(result.rects, this._canvasTransform);
      return;
    }
    this._renderer.hideAll();
  }
  _computeRects(_draggedRect) {
    return calculateMagneticRects(this._rects, _draggedRect, this._alignThreshold, this._spacingThreshold);
  }
  clearGuides() {
    this._renderer.hideAll();
    if (this._timerId) {
      clearTimeout(this._timerId);
      this._timerId = null;
    }
  }
};
var DragNodeFinalizeRequest = class {
  event;
  static fToken = Symbol("DragNodeFinalizeRequest");
  constructor(event) {
    this.event = event;
  }
};
var FMoveNodesEvent = class {
  /** Preferred name */
  nodes;
  /** @deprecated Use `nodes` */
  fNodes;
  constructor(nodes) {
    this.nodes = nodes;
    this.fNodes = nodes;
  }
};
var DragNodeFinalize = class DragNodeFinalize2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  _dragSession = inject(FDraggableDataContext);
  _dragHandler;
  handle({
    event
  }) {
    this._dragHandler = this._getDragHandler();
    if (!this._dragHandler) {
      return;
    }
    const delta = this._buildDragDelta(event.getPosition());
    const snaps = this._dragHandler.calculateMagneticSnaps(delta);
    const snappedDelta = this._applySnapToDelta(delta, snaps.lines, snaps.rects);
    this._finalizeMove(this._dragHandler, snappedDelta);
    this._emitNodeIntersectIfNeeded(this._dragHandler);
  }
  _getDragHandler() {
    return this._dragSession.draggableItems.find(isDragNodeHandler);
  }
  _buildDragDelta(pointerPosition) {
    return Point.fromPoint(pointerPosition).elementTransform(this._store.flowHost).div(this._dragSession.onPointerDownScale).sub(this._dragSession.onPointerDownPosition);
  }
  _applySnapToDelta(delta, lineSnap, rectSnap) {
    let x = delta.x;
    let y = delta.y;
    if (lineSnap) {
      x = this._hasLineSnapValue(lineSnap.x) ? delta.x - (lineSnap.x.delta || 0) : x;
      y = this._hasLineSnapValue(lineSnap.y) ? delta.y - (lineSnap.y.delta || 0) : y;
    }
    if (this._hasRectSnapValue(rectSnap)) {
      if (rectSnap.axis === "x") {
        x = delta.x - rectSnap.delta;
        y = delta.y - (rectSnap.crossDelta ?? 0);
      } else {
        y = delta.y - rectSnap.delta;
        x = delta.x - (rectSnap.crossDelta ?? 0);
      }
    }
    return {
      x,
      y
    };
  }
  _hasLineSnapValue(result) {
    return result.guide !== void 0 && result.guide !== null;
  }
  _hasRectSnapValue(result) {
    return !!result && result.axis !== void 0 && result.delta !== void 0;
  }
  _finalizeMove(handler, delta) {
    for (const root of handler.roots) {
      root.finalizeConstraints();
    }
    handler.onPointerMove(delta);
    handler.onPointerUp?.();
    this._store.fDraggable?.fMoveNodes.emit(this._buildMoveNodesEvent(handler));
  }
  _buildMoveNodesEvent(handler) {
    const dragEvent = handler.getEvent();
    const data = dragEvent.data ?? dragEvent.fData;
    const ids = data?.fNodeIds ?? [];
    const nodes = ids.map((id) => ({
      id,
      position: this._store.nodes.get(id)?._position
    }));
    return new FMoveNodesEvent(nodes);
  }
  _emitNodeIntersectIfNeeded(handler) {
    if (!this._isDraggedJustOneNode(handler) || !this._store.fDraggable?.fEmitOnNodeIntersect) {
      return;
    }
    const nodeOrGroup = handler.roots[0].nodeOrGroup;
    queueMicrotask(() => this._mediator.execute(new DetectConnectionsUnderDragNodeRequest(nodeOrGroup)));
  }
  _isDraggedJustOneNode(handler) {
    return handler.roots.length === 1;
  }
  static ɵfac = function DragNodeFinalize_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || DragNodeFinalize2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: DragNodeFinalize2,
    factory: DragNodeFinalize2.ɵfac
  });
};
DragNodeFinalize = __decorate([FExecutionRegister(DragNodeFinalizeRequest)], DragNodeFinalize);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DragNodeFinalize, [{
    type: Injectable
  }], null, null);
})();
var DragNodePreparationRequest = class {
  event;
  trigger;
  static fToken = Symbol("DragNodePreparationRequest");
  constructor(event, trigger) {
    this.event = event;
    this.trigger = trigger;
  }
};
var DragNodePreparation = class DragNodePreparation2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  _dragSession = inject(FDraggableDataContext);
  handle({
    event,
    trigger
  }) {
    if (!this._canStartDrag(event, trigger)) {
      return;
    }
    const node = this._findDraggableNode(event.targetElement);
    if (!node) {
      return;
    }
    this._storePointerDownContext(event);
    this._dragSession.draggableItems = [this._buildDragNodeHandler(node)];
    this._mediator.execute(new MagneticLinesPreparationRequest());
    this._mediator.execute(new MagneticRectsPreparationRequest());
  }
  _canStartDrag(event, trigger) {
    return this._dragSession.isEmpty() && this._isDragHandle(event.targetElement) && isValidEventTrigger(event.originalEvent, trigger);
  }
  _isDragHandle(element) {
    return isClosestElementHasClass(element, ".f-drag-handle");
  }
  _findDraggableNode(target) {
    const nodes = this._store.nodes.getAll();
    for (const node of nodes) {
      if (node.fDraggingDisabled()) {
        continue;
      }
      if (node.isContains(target)) {
        return node;
      }
    }
    return void 0;
  }
  _storePointerDownContext(event) {
    this._dragSession.onPointerDownScale = this._store.transform.scale;
    this._dragSession.onPointerDownPosition = Point.fromPoint(event.getPosition()).elementTransform(this._store.flowHost).div(this._store.transform.scale);
  }
  _buildDragNodeHandler(node) {
    if (node.fSelectionDisabled() || !node.isSelected()) {
      queueMicrotask(() => {
        this._mediator.execute(new SelectAndUpdateNodeLayerRequest(node));
      });
    }
    return this._mediator.execute(new AttachDragNodeHandlerFromSelectionRequest(node));
  }
  static ɵfac = function DragNodePreparation_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || DragNodePreparation2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: DragNodePreparation2,
    factory: DragNodePreparation2.ɵfac
  });
};
DragNodePreparation = __decorate([FExecutionRegister(DragNodePreparationRequest)], DragNodePreparation);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DragNodePreparation, [{
    type: Injectable
  }], null, null);
})();
var NODE_PROVIDERS = [...CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS, MagneticLinesPreparation, MagneticRectsPreparation, DragNodeFinalize, DragNodePreparation];
var FDropToGroupEvent = class {
  /** Preferred name: Group (target) id */
  targetGroupId;
  /** Preferred name: Dropped node ids */
  nodeIds;
  /** Preferred name: Pointer drop position */
  dropPosition;
  /** @deprecated Use `targetGroupId` */
  fTargetNode;
  /** @deprecated Use `nodeIds` */
  fNodes;
  /** @deprecated Use `dropPosition` */
  fDropPosition;
  constructor(targetGroupId, nodeIds, dropPosition) {
    this.targetGroupId = targetGroupId;
    this.nodeIds = nodeIds;
    this.dropPosition = dropPosition;
    this.fTargetNode = targetGroupId;
    this.fNodes = nodeIds;
    this.fDropPosition = dropPosition;
  }
};
var DropToGroupFinalize = class DropToGroupFinalize2 {
  _dragSession = inject(FDraggableDataContext);
  _store = inject(FComponentsStore);
  handle({
    event
  }) {
    const dropHandler = this._findDropHandler();
    if (!dropHandler) {
      return;
    }
    const target = dropHandler.activeTarget?.node;
    if (target) {
      this._emitDropToGroupEvent(target.fId(), event);
    }
    dropHandler.onPointerUp?.();
  }
  _findDropHandler() {
    return this._dragSession.draggableItems.find((x) => x instanceof DropToGroupHandler);
  }
  _emitDropToGroupEvent(targetId, event) {
    this._store.fDraggable?.fDropToGroup.emit(new FDropToGroupEvent(targetId, this._getTopLevelDraggedIds(), event.getPosition()));
  }
  /**
   * Returns only "top-level" dragged items:
   * if a node's parent is also in dragged set, we exclude the child.
   */
  _getTopLevelDraggedIds() {
    const summary = this._getMoveSummaryHandler();
    const dragged = summary.items.map((x) => x.nodeOrGroup);
    const draggedIdSet = new Set(dragged.map((n) => n.fId()));
    const result = [];
    for (const node of dragged) {
      const parentId = node.fParentId();
      if (!parentId || !draggedIdSet.has(parentId)) {
        result.push(node.fId());
      }
    }
    return result;
  }
  _getMoveSummaryHandler() {
    const handler = this._dragSession.draggableItems.find((x) => x instanceof DragNodeHandler);
    if (!handler) {
      throw new Error("DropToGroup requires DragNodeHandler.");
    }
    return handler;
  }
  static ɵfac = function DropToGroupFinalize_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || DropToGroupFinalize2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: DropToGroupFinalize2,
    factory: DropToGroupFinalize2.ɵfac
  });
};
DropToGroupFinalize = __decorate([FExecutionRegister(DropToGroupFinalizeRequest)], DropToGroupFinalize);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DropToGroupFinalize, [{
    type: Injectable
  }], null, null);
})();
var DropToGroupPreparationRequest = class {
  event;
  static fToken = Symbol("DropToGroupPreparationRequest");
  constructor(event) {
    this.event = event;
  }
};
var SortDropCandidatesByLayerRequest = class {
  candidates;
  static fToken = Symbol("SortDropCandidatesByLayerRequest");
  constructor(candidates) {
    this.candidates = candidates;
  }
};
var SortDropCandidatesByLayer = class SortDropCandidatesByLayer2 {
  handle({
    candidates
  }) {
    const indexed = candidates.map((candidate, index) => ({
      candidate,
      index
    }));
    indexed.sort((a, b) => {
      const domOrder = this._compareDomOrder(a.candidate.node.hostElement, b.candidate.node.hostElement);
      if (domOrder !== 0) {
        return -domOrder;
      }
      return a.index - b.index;
    });
    return indexed.map((x) => x.candidate);
  }
  _compareDomOrder(a, b) {
    if (a === b) {
      return 0;
    }
    const pos = a.compareDocumentPosition(b);
    if ((pos & Node.DOCUMENT_POSITION_FOLLOWING) !== 0) {
      return -1;
    }
    if ((pos & Node.DOCUMENT_POSITION_PRECEDING) !== 0) {
      return 1;
    }
    if (pos & Node.DOCUMENT_POSITION_DISCONNECTED) {
      const ar = a.getBoundingClientRect?.() ?? {
        top: 0,
        left: 0
      };
      const br = b.getBoundingClientRect?.() ?? {
        top: 0,
        left: 0
      };
      if (ar.top !== br.top) {
        return ar.top < br.top ? -1 : 1;
      }
      if (ar.left !== br.left) {
        return ar.left < br.left ? -1 : 1;
      }
      return 0;
    }
    return 0;
  }
  static ɵfac = function SortDropCandidatesByLayer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SortDropCandidatesByLayer2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: SortDropCandidatesByLayer2,
    factory: SortDropCandidatesByLayer2.ɵfac
  });
};
SortDropCandidatesByLayer = __decorate([FExecutionRegister(SortDropCandidatesByLayerRequest)], SortDropCandidatesByLayer);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SortDropCandidatesByLayer, [{
    type: Injectable
  }], null, null);
})();
var ExternalRectConstraint = class {
  _onPointerDown;
  _limit;
  _vCellSize;
  _hCellSize;
  _adjustCellSize;
  constructor(injector, _onPointerDown, _limit) {
    this._onPointerDown = _onPointerDown;
    this._limit = _limit;
    const store = injector.get(FComponentsStore);
    this._vCellSize = store.fDraggable.vCellSize();
    this._hCellSize = store.fDraggable.hCellSize();
    this._adjustCellSize = store.fDraggable.fCellSizeWhileDragging();
  }
  limit(difference) {
    const {
      min,
      max
    } = this._limit;
    const {
      x,
      y
    } = this._cellSizeStrategies[+this._adjustCellSize](difference);
    return {
      x: this._clamp(x, min.x, max.x),
      y: this._clamp(y, min.y, max.y)
    };
  }
  _cellSizeStrategies = {
    0: this._skipCellSize.bind(this),
    1: this._applyCellSize.bind(this)
  };
  _applyCellSize(difference) {
    return {
      x: this._snapToGrid(this._onPointerDown.x + difference.x, this._hCellSize) - this._onPointerDown.x,
      y: this._snapToGrid(this._onPointerDown.y + difference.y, this._vCellSize) - this._onPointerDown.y
    };
  }
  _skipCellSize(difference) {
    return difference;
  }
  _clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  _snapToGrid(value, cellSize) {
    return Math.round(value / cellSize) * cellSize;
  }
};
var DragExternalItemCreatePlaceholderRequest = class {
  externalItem;
  static fToken = Symbol("DragExternalItemCreatePlaceholderRequest");
  constructor(externalItem) {
    this.externalItem = externalItem;
  }
};
var DragExternalItemCreatePlaceholder = class DragExternalItemCreatePlaceholder2 {
  _browser = inject(BrowserService);
  _containerRef = inject(ViewContainerRef);
  handle({
    externalItem
  }) {
    const {
      hostElement,
      placeholder
    } = externalItem;
    const placeholderElement = placeholder();
    const result = placeholderElement ? this._fromTemplate(placeholderElement) : this._fromHost(hostElement);
    result.classList.add("f-external-item-placeholder");
    result.style.pointerEvents = "none";
    return result;
  }
  _fromTemplate(template) {
    return getOrCreateRootNodeForViewRef(this._createViewRef(template), this._browser.document);
  }
  _fromHost(element) {
    return deepCloneNode(element);
  }
  _createViewRef(template) {
    const result = this._containerRef.createEmbeddedView(template);
    result.detectChanges();
    return result;
  }
  static ɵfac = function DragExternalItemCreatePlaceholder_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || DragExternalItemCreatePlaceholder2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: DragExternalItemCreatePlaceholder2,
    factory: DragExternalItemCreatePlaceholder2.ɵfac
  });
};
DragExternalItemCreatePlaceholder = __decorate([FExecutionRegister(DragExternalItemCreatePlaceholderRequest)], DragExternalItemCreatePlaceholder);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DragExternalItemCreatePlaceholder, [{
    type: Injectable
  }], null, null);
})();
var DragExternalItemCreatePreviewRequest = class {
  externalItem;
  static fToken = Symbol("DragExternalItemCreatePreviewRequest");
  constructor(externalItem) {
    this.externalItem = externalItem;
  }
};
var DragExternalItemCreatePreview = class DragExternalItemCreatePreview2 {
  _browser = inject(BrowserService);
  _containerRef = inject(ViewContainerRef);
  handle({
    externalItem
  }) {
    const {
      hostElement,
      preview
    } = externalItem;
    const previewElement = preview();
    const result = previewElement ? this._fromTemplate(previewElement) : this._fromHost(hostElement);
    this._setPreviewStyles(result);
    disableDragInteractions(result);
    result.classList.add("f-external-item-preview");
    return result;
  }
  _fromTemplate(template) {
    return getOrCreateRootNodeForViewRef(this._createViewRef(template), this._browser.document);
  }
  _fromHost(element) {
    return deepCloneNode(element);
  }
  _createViewRef(template) {
    const result = this._containerRef.createEmbeddedView(template);
    result.detectChanges();
    return result;
  }
  _setPreviewStyles(element) {
    extendStyles(element.style, {
      "pointer-events": "none",
      "margin": "showPopover" in element ? "0 auto 0 0" : "0",
      "position": "fixed",
      "top": "0",
      "left": "0",
      "z-index": "1000"
    }, /* @__PURE__ */ new Set(["position"]));
  }
  static ɵfac = function DragExternalItemCreatePreview_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || DragExternalItemCreatePreview2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: DragExternalItemCreatePreview2,
    factory: DragExternalItemCreatePreview2.ɵfac
  });
};
DragExternalItemCreatePreview = __decorate([FExecutionRegister(DragExternalItemCreatePreviewRequest)], DragExternalItemCreatePreview);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DragExternalItemCreatePreview, [{
    type: Injectable
  }], null, null);
})();
var DragExternalItemFinalizeRequest = class {
  event;
  static fToken = Symbol("DragExternalItemFinalizeRequest");
  constructor(event) {
    this.event = event;
  }
};
var FCreateNodeEvent = class {
  // -----------------------------
  // Preferred API
  // -----------------------------
  /** Rect of the dragged external item at the moment of drop (in flow coordinates). */
  externalItemRect;
  /** External item data payload. */
  data;
  /** Id of node/group where item was dropped (if any). */
  targetContainerId;
  /** Pointer drop position in flow coordinates (if provided). */
  dropPosition;
  // -----------------------------
  // Deprecated compatibility API
  // -----------------------------
  /** @deprecated Use `externalItemRect` */
  rect;
  /** @deprecated Use `targetContainerId` */
  fTargetNode;
  /** @deprecated Use `dropPosition` */
  fDropPosition;
  constructor(externalItemRect, data, targetContainerId, dropPosition) {
    this.externalItemRect = externalItemRect;
    this.data = data;
    this.targetContainerId = targetContainerId;
    this.dropPosition = dropPosition;
    this.rect = externalItemRect;
    this.fTargetNode = targetContainerId;
    this.fDropPosition = dropPosition;
  }
};
var DRAG_EXTERNAL_ITEM_HANDLER_TYPE = "external-item";
var DRAG_EXTERNAL_ITEM_HANDLER_KIND = "drag-external-item";
function isDragExternalItemHandler(value) {
  return value.getEvent().kind === DRAG_EXTERNAL_ITEM_HANDLER_KIND || value.getEvent().fEventType === DRAG_EXTERNAL_ITEM_HANDLER_TYPE;
}
var DragExternalItemFinalize = class DragExternalItemFinalize2 {
  _result = inject(FDragHandlerResult);
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  _dragSession = inject(FDraggableDataContext);
  _browser = inject(BrowserService);
  get _createNodeEmitter() {
    return this._store.fDraggable?.fCreateNode;
  }
  handle(request) {
    const handler = this._findExternalItemHandler();
    if (!handler) {
      return;
    }
    const targetContainerId = this._getDestinationNodeOrGroupId();
    this._emitEvent(this._getElementsFromPoint(request.event.getPosition()), targetContainerId, request.event.getPosition());
    handler.onPointerUp();
    this._dragSession.draggableItems = [];
  }
  _findExternalItemHandler() {
    return this._dragSession.draggableItems.find((x) => isDragExternalItemHandler(x));
  }
  _getDestinationNodeOrGroupId() {
    const handler = this._getDropToGroupHandler();
    const result = handler.activeTarget?.node.fId();
    handler.onPointerUp?.();
    return result;
  }
  _getDropToGroupHandler() {
    const result = this._dragSession.draggableItems.find((x) => x instanceof DropToGroupHandler);
    if (!result) {
      throw new Error("NodeDragToParentDragHandler not found");
    }
    return result;
  }
  _getElementsFromPoint(position) {
    return this._browser.document.elementsFromPoint(position.x, position.y).filter((x) => !x.closest(".f-external-item") && !x.closest(".f-external-item-preview"));
  }
  _emitEvent(elements, destinationNodeOrGroupId, eventPosition) {
    if (this._isPointerInCanvasRect(elements)) {
      this._createNodeEmitter?.emit(new FCreateNodeEvent(this._getPreviewRect(), this._result.getData().externalItem.data(), destinationNodeOrGroupId, destinationNodeOrGroupId ? eventPosition : void 0));
    }
  }
  _isPointerInCanvasRect(elements) {
    return elements.length ? this._store.flowHost.contains(elements[0]) : false;
  }
  _getPreviewRect() {
    return this._mediator.execute(new GetNormalizedElementRectRequest(this._result.getData().preview));
  }
  static ɵfac = function DragExternalItemFinalize_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || DragExternalItemFinalize2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: DragExternalItemFinalize2,
    factory: DragExternalItemFinalize2.ɵfac
  });
};
DragExternalItemFinalize = __decorate([FExecutionRegister(DragExternalItemFinalizeRequest)], DragExternalItemFinalize);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DragExternalItemFinalize, [{
    type: Injectable
  }], null, null);
})();
var FDragExternalItemStartEventData = class {
  data;
  constructor(data) {
    this.data = data;
  }
};
var DragExternalItemHandler = class extends DragHandlerBase {
  _externalItem;
  _pointerDownClientPosition;
  type = "external-item";
  kind = "drag-external-item";
  data() {
    return new FDragExternalItemStartEventData(this._externalItem.data());
  }
  _result;
  _mediator;
  _browser;
  _store;
  _previewEl;
  _placeholderEl;
  _startRect = RectExtensions.initialize();
  _pointerDownRect = RectExtensions.initialize();
  _absoluteOffsetFromFlow = PointExtensions.initialize();
  _grabOffsetFromPointer = PointExtensions.initialize();
  _originalParent;
  _originalNextSibling;
  _originalDisplay;
  _applyConstraints = (d) => d;
  constructor(injector, _externalItem, _pointerDownClientPosition) {
    super();
    this._externalItem = _externalItem;
    this._pointerDownClientPosition = _pointerDownClientPosition;
    this._store = injector.get(FComponentsStore);
    this._result = injector.get(FDragHandlerResult);
    this._mediator = injector.get(FMediator);
    this._browser = injector.get(BrowserService);
    this._originalDisplay = this._host.style.display;
    this._initConstraints(injector);
  }
  get _host() {
    return this._externalItem.hostElement;
  }
  /** Overlay root: fullscreenElement (if any) or document.body */
  get _overlayRoot() {
    return this._browser.document.fullscreenElement ?? this._browser.document.body;
  }
  get _transform() {
    return this._store.transform;
  }
  _initConstraints(injector) {
    this._startRect = this._getStartRect();
    const constraint = new ExternalRectConstraint(injector, this._startRect, infinityMinMax());
    this._applyConstraints = (delta) => constraint.limit(delta);
  }
  _getStartRect() {
    return this._mediator.execute(new GetNormalizedElementRectRequest(this._externalItem.hostElement));
  }
  prepareDragSequence() {
    this._pointerDownRect = this._readAbsoluteRect(this._host);
    this._absoluteOffsetFromFlow = Point.fromPoint(this._pointerDownRect).sub(this._toAbsolutePoint(this._startRect));
    this._grabOffsetFromPointer = this._clientToAbsolute(this._pointerDownClientPosition).sub(this._pointerDownRect);
    this._rememberOriginalPlacement();
    this._previewEl = this._createPreview();
    this._placeholderEl = this._createPlaceholder();
    this._placePreviewIntoOverlay();
    this._swapOriginalWithPlaceholderAndMoveOriginalIntoOverlay();
    this._result.setData({
      preview: this._previewEl,
      externalItem: this._externalItem
    });
  }
  _rememberOriginalPlacement() {
    const parent = this._host.parentNode;
    if (!parent) {
      this._originalParent = void 0;
      this._originalNextSibling = null;
      return;
    }
    this._originalParent = parent;
    this._originalNextSibling = this._host.nextSibling;
  }
  _createPreview() {
    const el = this._mediator.execute(new DragExternalItemCreatePreviewRequest(this._externalItem));
    if (this._externalItem.previewMatchSize()) {
      this._matchSize(el, this._pointerDownRect);
    }
    el.style.transform = _translate(this._pointerDownRect);
    return el;
  }
  _createPlaceholder() {
    return this._mediator.execute(new DragExternalItemCreatePlaceholderRequest(this._externalItem));
  }
  _placePreviewIntoOverlay() {
    this._overlayRoot.appendChild(this._previewEl);
  }
  _swapOriginalWithPlaceholderAndMoveOriginalIntoOverlay() {
    const parent = this._originalParent;
    const placeholder = this._placeholderEl;
    if (!parent || !placeholder) return;
    const detachedOriginal = parent.replaceChild(placeholder, this._host);
    this._overlayRoot.appendChild(detachedOriginal);
    this._host.style.display = "none";
  }
  onPointerMove(delta, event) {
    if (!this._previewEl) return;
    const desiredDelta = this._resolveDeltaFromPointer(delta, event);
    const constrained = this._applyConstraints(desiredDelta);
    const pointInFlow = Point.fromPoint(this._startRect).add(constrained);
    const next = this._toAbsolutePoint(pointInFlow).add(this._absoluteOffsetFromFlow);
    this._previewEl.style.transform = _translate(next);
  }
  onPointerUp() {
    if (this._previewEl && this._previewEl.parentNode) {
      this._previewEl.parentNode.removeChild(this._previewEl);
    }
    this._restoreOriginalInParent();
    this._host.style.display = this._originalDisplay || "block";
    this._previewEl = void 0;
    this._placeholderEl = void 0;
    this._originalParent = void 0;
    this._originalNextSibling = null;
  }
  _restoreOriginalInParent() {
    const parent = this._originalParent;
    const placeholder = this._placeholderEl;
    if (!parent || !placeholder) return;
    if (placeholder.parentNode === parent) {
      parent.replaceChild(this._host, placeholder);
      return;
    }
    if (this._originalNextSibling && this._originalNextSibling.parentNode === parent) {
      parent.insertBefore(this._host, this._originalNextSibling);
    } else {
      parent.appendChild(this._host);
    }
  }
  _matchSize(target, rect) {
    target.style.width = `${rect.width}px`;
    target.style.height = `${rect.height}px`;
  }
  _readAbsoluteRect(el) {
    const rect = el.getBoundingClientRect();
    const scrollTop = this._browser.window.pageYOffset || this._browser.document.documentElement.scrollTop;
    const scrollLeft = this._browser.window.pageXOffset || this._browser.document.documentElement.scrollLeft;
    return RectExtensions.initialize(rect.left + scrollLeft, rect.top + scrollTop, rect.width, rect.height);
  }
  _toAbsolutePoint(pointInFlow) {
    const offset = Point.fromPoint(this._transform.position).add(this._transform.scaledPosition);
    return Point.fromPoint(pointInFlow).mult(this._transform.scale).add(offset).add(this._getFlowHostAbsolutePosition());
  }
  _resolveDeltaFromPointer(fallbackDelta, event) {
    const pointerClient = event?.getPosition();
    if (!pointerClient) {
      return fallbackDelta;
    }
    const desiredPreviewAbsolutePoint = this._clientToAbsolute(pointerClient).sub(this._grabOffsetFromPointer);
    const desiredFlowPoint = this._toFlowPoint(desiredPreviewAbsolutePoint);
    return Point.fromPoint(desiredFlowPoint).sub(this._startRect);
  }
  _toFlowPoint(absolutePoint) {
    const hostAbsolute = this._getFlowHostAbsolutePosition();
    const offset = Point.fromPoint(this._transform.position).add(this._transform.scaledPosition);
    return Point.fromPoint(absolutePoint).sub(hostAbsolute).sub(offset).div(this._transform.scale);
  }
  _getFlowHostAbsolutePosition() {
    const hostRect = this._store.flowHost.getBoundingClientRect();
    const scrollTop = this._browser.window.pageYOffset || this._browser.document.documentElement.scrollTop;
    const scrollLeft = this._browser.window.pageXOffset || this._browser.document.documentElement.scrollLeft;
    return PointExtensions.initialize(hostRect.left + scrollLeft, hostRect.top + scrollTop);
  }
  _clientToAbsolute(clientPoint) {
    const scrollTop = this._browser.window.pageYOffset || this._browser.document.documentElement.scrollTop;
    const scrollLeft = this._browser.window.pageXOffset || this._browser.document.documentElement.scrollLeft;
    return Point.fromPoint(clientPoint).add(PointExtensions.initialize(scrollLeft, scrollTop));
  }
};
function _translate({
  x,
  y
}) {
  return `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
}
var DragExternalItemPreparationRequest = class {
  event;
  fTrigger;
  static fToken = Symbol("DragExternalItemPreparationRequest");
  constructor(event, fTrigger) {
    this.event = event;
    this.fTrigger = fTrigger;
  }
};
var F_EXTERNAL_ITEM = new InjectionToken("F_EXTERNAL_ITEM");
var FExternalItemBase = class _FExternalItemBase {
  hostElement = inject(ElementRef).nativeElement;
  static ɵfac = function FExternalItemBase_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FExternalItemBase)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FExternalItemBase
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FExternalItemBase, [{
    type: Directive
  }], null, null);
})();
function isExternalItem(element) {
  return !!element.closest?.("[fExternalItem]");
}
function getExternalItemHost(element) {
  return element.closest("[fExternalItem]");
}
var FExternalItemService = class _FExternalItemService {
  _byHost = /* @__PURE__ */ new Map();
  _items = signal([], ...ngDevMode ? [{
    debugName: "_items"
  }] : []);
  /** Reactive list (internal consumers) */
  items = computed(() => this._items(), ...ngDevMode ? [{
    debugName: "items"
  }] : []);
  /** lookup by element (supports passing a nested child) */
  getByElement(el) {
    const host = getExternalItemHost(el);
    return host ? this._byHost.get(host) : void 0;
  }
  /** lookup by host */
  getByHost(host) {
    return this._byHost.get(host);
  }
  register(item) {
    const host = item.hostElement;
    const existing = this._byHost.get(host);
    if (existing === item) {
      return;
    }
    if (existing && existing !== item) {
      this._byHost.delete(host);
    }
    this._byHost.set(host, item);
    this._sync();
  }
  remove(item) {
    const host = item.hostElement;
    if (this._byHost.get(host) !== item) {
      return;
    }
    this._byHost.delete(host);
    this._sync();
  }
  _sync() {
    this._items.set([...this._byHost.values()]);
  }
  static ɵfac = function FExternalItemService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FExternalItemService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _FExternalItemService,
    factory: _FExternalItemService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FExternalItemService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var uniqueId$6 = 0;
var FExternalItem = class _FExternalItem extends FExternalItemBase {
  _apiService = inject(FExternalItemService);
  /** Stable id for matching drag sessions, lookups, etc. */
  externalItemId = input(`f-external-item-${uniqueId$6++}`, ...ngDevMode ? [{
    debugName: "externalItemId",
    alias: "fExternalItemId"
  }] : [{
    alias: "fExternalItemId"
  }]);
  /** Payload attached to external item. */
  data = input(void 0, ...ngDevMode ? [{
    debugName: "data",
    alias: "fData"
  }] : [{
    alias: "fData"
  }]);
  /** Disables dragging/interaction. */
  disabled = input(false, ...ngDevMode ? [{
    debugName: "disabled",
    alias: "fDisabled",
    transform: booleanAttribute
  }] : [{
    alias: "fDisabled",
    transform: booleanAttribute
  }]);
  /** Template shown while item is dragged (preview). */
  preview = model(void 0, ...ngDevMode ? [{
    debugName: "preview",
    alias: "fPreview"
  }] : [{
    alias: "fPreview"
  }]);
  /** Whether preview should match original element size. */
  previewMatchSize = input(true, ...ngDevMode ? [{
    debugName: "previewMatchSize",
    alias: "fPreviewMatchSize",
    transform: booleanAttribute
  }] : [{
    alias: "fPreviewMatchSize",
    transform: booleanAttribute
  }]);
  /** Placeholder template that stays in original place while dragging. */
  placeholder = model(void 0, ...ngDevMode ? [{
    debugName: "placeholder",
    alias: "fPlaceholder"
  }] : [{
    alias: "fPlaceholder"
  }]);
  ngOnInit() {
    this._apiService.register(this);
    this._disablePointerEvents(Array.from(this.hostElement.children));
  }
  _disablePointerEvents(children) {
    children.forEach((x) => {
      x.style.pointerEvents = "none";
      this._disablePointerEvents(Array.from(x.children));
    });
  }
  ngOnDestroy() {
    this._apiService.register(this);
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFExternalItem_BaseFactory;
    return function FExternalItem_Factory(__ngFactoryType__) {
      return (ɵFExternalItem_BaseFactory || (ɵFExternalItem_BaseFactory = ɵɵgetInheritedFactory(_FExternalItem)))(__ngFactoryType__ || _FExternalItem);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _FExternalItem,
    selectors: [["", "fExternalItem", ""]],
    hostAttrs: [1, "f-component", "f-external-item"],
    hostVars: 3,
    hostBindings: function FExternalItem_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("id", ctx.externalItemId());
        ɵɵclassProp("f-external-item-disabled", ctx.disabled());
      }
    },
    inputs: {
      externalItemId: [1, "fExternalItemId", "externalItemId"],
      data: [1, "fData", "data"],
      disabled: [1, "fDisabled", "disabled"],
      preview: [1, "fPreview", "preview"],
      previewMatchSize: [1, "fPreviewMatchSize", "previewMatchSize"],
      placeholder: [1, "fPlaceholder", "placeholder"]
    },
    outputs: {
      preview: "fPreviewChange",
      placeholder: "fPlaceholderChange"
    },
    features: [ɵɵProvidersFeature([{
      provide: F_EXTERNAL_ITEM,
      useExisting: _FExternalItem
    }]), ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FExternalItem, [{
    type: Directive,
    args: [{
      selector: "[fExternalItem]",
      standalone: true,
      host: {
        "[attr.id]": "externalItemId()",
        class: "f-component f-external-item",
        "[class.f-external-item-disabled]": "disabled()"
      },
      providers: [{
        provide: F_EXTERNAL_ITEM,
        useExisting: FExternalItem
      }]
    }]
  }], null, {
    externalItemId: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fExternalItemId",
        required: false
      }]
    }],
    data: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fData",
        required: false
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fDisabled",
        required: false
      }]
    }],
    preview: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fPreview",
        required: false
      }]
    }, {
      type: Output,
      args: ["fPreviewChange"]
    }],
    previewMatchSize: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fPreviewMatchSize",
        required: false
      }]
    }],
    placeholder: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fPlaceholder",
        required: false
      }]
    }, {
      type: Output,
      args: ["fPlaceholderChange"]
    }]
  });
})();
var FExternalItemPlaceholder = class _FExternalItemPlaceholder {
  _instance = inject(F_EXTERNAL_ITEM);
  _templateRef = inject(TemplateRef);
  ngOnInit() {
    this._instance.placeholder.set(this._templateRef);
  }
  ngOnDestroy() {
    this._instance.placeholder.set(void 0);
  }
  static ɵfac = function FExternalItemPlaceholder_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FExternalItemPlaceholder)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FExternalItemPlaceholder,
    selectors: [["ng-template", "fExternalItemPlaceholder", ""]],
    hostAttrs: [1, "f-component", "f-external-item-placeholder"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FExternalItemPlaceholder, [{
    type: Directive,
    args: [{
      selector: "ng-template[fExternalItemPlaceholder]",
      standalone: true,
      host: {
        class: "f-component f-external-item-placeholder"
      }
    }]
  }], null, null);
})();
var FExternalItemPreview = class _FExternalItemPreview {
  _instance = inject(F_EXTERNAL_ITEM);
  _templateRef = inject(TemplateRef);
  ngOnInit() {
    this._instance.preview.set(this._templateRef);
  }
  ngOnDestroy() {
    this._instance.preview.set(void 0);
  }
  static ɵfac = function FExternalItemPreview_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FExternalItemPreview)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FExternalItemPreview,
    selectors: [["ng-template", "fExternalItemPreview", ""]],
    hostAttrs: [1, "f-component", "f-external-item-preview"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FExternalItemPreview, [{
    type: Directive,
    args: [{
      selector: "ng-template[fExternalItemPreview]",
      standalone: true,
      host: {
        class: "f-component f-external-item-preview"
      }
    }]
  }], null, null);
})();
var F_EXTERNAL_ITEM_PROVIDERS = [FExternalItem];
var DragExternalItemPreparation = class DragExternalItemPreparation2 {
  _apiService = inject(FExternalItemService);
  _dragSession = inject(FDraggableDataContext);
  _store = inject(FComponentsStore);
  _injector = inject(Injector);
  get _flowHost() {
    return this._store.flowHost;
  }
  get _transform() {
    return this._store.transform;
  }
  handle({
    event,
    fTrigger
  }) {
    if (!this._dragSession.isEmpty()) {
      return;
    }
    if (!isValidEventTrigger(event.originalEvent, fTrigger)) {
      return;
    }
    const item = this._resolveExternalItem(event.targetElement);
    if (!item || item.disabled()) {
      return;
    }
    const scale = this._transform.scale ?? 1;
    this._dragSession.onPointerDownScale = scale;
    this._dragSession.onPointerDownPosition = Point.fromPoint(event.getPosition()).elementTransform(this._flowHost).div(scale);
    this._dragSession.draggableItems = [new DragExternalItemHandler(this._injector, item, event.getPosition())];
  }
  _resolveExternalItem(target) {
    return this._apiService.getByElement(target);
  }
  static ɵfac = function DragExternalItemPreparation_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || DragExternalItemPreparation2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: DragExternalItemPreparation2,
    factory: DragExternalItemPreparation2.ɵfac
  });
};
DragExternalItemPreparation = __decorate([FExecutionRegister(DragExternalItemPreparationRequest)], DragExternalItemPreparation);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DragExternalItemPreparation, [{
    type: Injectable
  }], null, null);
})();
var PreventDefaultIsExternalItemRequest = class {
  event;
  static fToken = Symbol("PreventDefaultIsExternalItemRequest");
  constructor(event) {
    this.event = event;
  }
};
var PreventDefaultIsExternalItem = class PreventDefaultIsExternalItem2 {
  handle(request) {
    if (!this._isTargetItemExternal(request.event)) {
      return;
    }
    request.event.preventDefault();
  }
  _isTargetItemExternal(event) {
    const isTargetItemExternal = this._isExternalItem(event.target);
    const isTargetParentItemExternal = this._isExternalItem(event.target.parentNode);
    return isTargetItemExternal || isTargetParentItemExternal;
  }
  _isExternalItem(target) {
    let result = false;
    try {
      result = isExternalItem(target);
    } catch (e) {
    }
    return result;
  }
  static ɵfac = function PreventDefaultIsExternalItem_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || PreventDefaultIsExternalItem2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: PreventDefaultIsExternalItem2,
    factory: PreventDefaultIsExternalItem2.ɵfac
  });
};
PreventDefaultIsExternalItem = __decorate([FExecutionRegister(PreventDefaultIsExternalItemRequest)], PreventDefaultIsExternalItem);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PreventDefaultIsExternalItem, [{
    type: Injectable
  }], null, null);
})();
var DRAG_EXTERNAL_ITEM_PROVIDERS = [DragExternalItemCreatePlaceholder, DragExternalItemCreatePreview, DragExternalItemFinalize, DragExternalItemPreparation, PreventDefaultIsExternalItem];
var DropToGroupPreparation = class DropToGroupPreparation2 {
  _mediator = inject(FMediator);
  _dragContext = inject(FDraggableDataContext);
  _store = inject(FComponentsStore);
  _dragInjector = inject(DragHandlerInjector);
  get _allNodes() {
    return this._store.nodes.getAll();
  }
  handle({
    event
  }) {
    if (!this._canPrepare()) {
      return;
    }
    const dragTargetNode = this._allNodes.find((n) => n.isContains(event.targetElement));
    if (!dragTargetNode && !this._hasExternalDrag()) {
      throw new Error("Drag target node not found");
    }
    let targets = this._sortedTargetsForDrop();
    if (dragTargetNode) {
      const parentId = dragTargetNode.fParentId();
      const allowedIds = this._mediator.execute(new GetChildNodeIdsRequest(parentId));
      if (allowedIds.length) {
        targets = targets.filter((t) => allowedIds.includes(t.node.fId()));
      }
    }
    const handler = this._dragInjector.get(DropToGroupHandler);
    handler.initialize(targets);
    this._dragContext.draggableItems.push(handler);
  }
  _canPrepare() {
    return this._hasMoveDrag() || this._hasExternalDrag();
  }
  _hasMoveDrag() {
    return this._dragContext.draggableItems.some((x) => x instanceof DragNodeHandler);
  }
  _hasExternalDrag() {
    return this._dragContext.draggableItems.some((x) => x instanceof DragExternalItemHandler);
  }
  _sortedTargetsForDrop() {
    const dragged = this._getDraggedNodes();
    const draggingGroup = dragged.some((x) => x instanceof FGroupDirective);
    const draggedWithParents = this._withParents(dragged);
    const eligible = this._eligibleTargets(draggedWithParents, draggingGroup);
    const targets = eligible.map((node) => {
      const rect = this._mediator.execute(new GetNormalizedElementRectRequest(node.hostElement));
      return {
        node,
        rect
      };
    });
    return this._mediator.execute(new SortDropCandidatesByLayerRequest(targets));
  }
  _getDraggedNodes() {
    const handler = this._dragContext.draggableItems.find((x) => x instanceof DragNodeHandler);
    return handler ? handler.items.map((h) => h.nodeOrGroup) : [];
  }
  _withParents(nodes) {
    return nodes.reduce((result, node) => {
      result.push(node);
      const parents = this._mediator.execute(new GetParentNodesRequest(node));
      result.push(...parents);
      return result;
    }, []);
  }
  _eligibleTargets(draggedWithParents, draggingGroup) {
    const nonDragged = this._allNodes.filter((n) => !draggedWithParents.includes(n));
    return draggingGroup ? nonDragged.filter((n) => n instanceof FGroupDirective) : nonDragged;
  }
  static ɵfac = function DropToGroupPreparation_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || DropToGroupPreparation2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: DropToGroupPreparation2,
    factory: DropToGroupPreparation2.ɵfac
  });
};
DropToGroupPreparation = __decorate([FExecutionRegister(DropToGroupPreparationRequest)], DropToGroupPreparation);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DropToGroupPreparation, [{
    type: Injectable
  }], null, null);
})();
var DRAG_DROP_TO_GROUP_PROVIDERS = [SortDropCandidatesByLayer, DropToGroupPreparation, DropToGroupFinalize];
var PinchToZoomFinalizeRequest = class {
  event;
  static fToken = Symbol("PinchToZoomFinalizeRequest");
  constructor(event) {
    this.event = event;
  }
};
var PINCH_MOVEMENT_THRESHOLD = 0.5;
var PinchToZoomHandler = class _PinchToZoomHandler extends DragHandlerBase {
  type = "pinch-to-zoom";
  kind = "pinch-to-zoom";
  _store = inject(FComponentsStore);
  get _flowHost() {
    return this._store.flowHost;
  }
  get _canvas() {
    return this._store.fCanvas;
  }
  get _zoomComponent() {
    return this._store.instances.require(INSTANCES.ZOOM);
  }
  _startDistance = null;
  _startScale = null;
  _touches;
  initialize(touches) {
    this._touches = touches;
  }
  prepareDragSequence() {
    const distance = calculateTouchDistance(this._touches);
    if (distance == null) return;
    this._startDistance = distance;
    this._startScale = this._canvas.transform.scale;
  }
  onPointerMove(_, event) {
    if (event.touches.length !== 2 || this._startDistance == null || this._startScale == null) {
      return;
    }
    const distance = calculateTouchDistance(event.touches);
    const center = calculateTouchCenter(event.touches);
    if (distance == null || center == null) {
      this._reset();
      return;
    }
    if (Math.abs(distance - this._startDistance) < PINCH_MOVEMENT_THRESHOLD) {
      return;
    }
    event.preventDefault();
    const ratio = distance / this._startDistance;
    const nextScale = this._clamp(this._startScale * ratio);
    this._canvas.setScale(nextScale, this._castPositionToFlow(center));
    this._canvas.redraw();
  }
  _clamp(value) {
    return Math.max(this._zoomComponent.minimum, Math.min(value, this._zoomComponent.maximum));
  }
  _castPositionToFlow(position) {
    return Point.fromPoint(position).elementTransform(this._flowHost);
  }
  _reset() {
    this._startScale = null;
    this._startDistance = null;
  }
  onPointerUp() {
    this._reset();
    this._canvas.emitCanvasChangeEvent();
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵPinchToZoomHandler_BaseFactory;
    return function PinchToZoomHandler_Factory(__ngFactoryType__) {
      return (ɵPinchToZoomHandler_BaseFactory || (ɵPinchToZoomHandler_BaseFactory = ɵɵgetInheritedFactory(_PinchToZoomHandler)))(__ngFactoryType__ || _PinchToZoomHandler);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _PinchToZoomHandler,
    factory: _PinchToZoomHandler.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PinchToZoomHandler, [{
    type: Injectable
  }], null, null);
})();
function calculateTouchCenter(touches) {
  if (touches.length !== 2) {
    return null;
  }
  const a = touches[0];
  const b = touches[1];
  return PointExtensions.initialize((a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2);
}
function calculateTouchDistance(touches) {
  if (touches.length !== 2) {
    return null;
  }
  const a = touches[0];
  const b = touches[1];
  return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
}
var PinchToZoomFinalize = class PinchToZoomFinalize2 {
  _dragSession = inject(FDraggableDataContext);
  handle(_) {
    if (!this._hasPinchZoomHandler()) {
      return;
    }
    for (const item of this._dragSession.draggableItems) {
      item.onPointerUp?.();
    }
  }
  _hasPinchZoomHandler() {
    return this._dragSession.draggableItems.some((x) => x instanceof PinchToZoomHandler);
  }
  static ɵfac = function PinchToZoomFinalize_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || PinchToZoomFinalize2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: PinchToZoomFinalize2,
    factory: PinchToZoomFinalize2.ɵfac
  });
};
PinchToZoomFinalize = __decorate([FExecutionRegister(PinchToZoomFinalizeRequest)], PinchToZoomFinalize);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PinchToZoomFinalize, [{
    type: Injectable
  }], null, null);
})();
var PinchToZoomPreparationRequest = class {
  event;
  static fToken = Symbol("PinchToZoomPreparationRequest");
  constructor(event) {
    this.event = event;
  }
};
var PinchToZoomPreparation = class PinchToZoomPreparation2 {
  _dragInjector = inject(DragHandlerInjector);
  _store = inject(FComponentsStore);
  _dragSession = inject(FDraggableDataContext);
  handle({
    event
  }) {
    if (!this._canStart(event)) {
      return;
    }
    this._dragSession.onPointerDownScale = 1;
    this._dragSession.onPointerDownPosition = new Point();
    this._dragSession.draggableItems = [this._getHandler(event)];
  }
  _canStart(event) {
    return this._dragSession.isEmpty() && event.touches?.length === 2 && !event.isEventInLockedContext && this._hasZoomComponent();
  }
  _hasZoomComponent() {
    return this._store.instances.has(INSTANCES.ZOOM);
  }
  _getHandler(event) {
    const handler = this._dragInjector.get(PinchToZoomHandler);
    handler.initialize(event.touches);
    return handler;
  }
  static ɵfac = function PinchToZoomPreparation_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || PinchToZoomPreparation2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: PinchToZoomPreparation2,
    factory: PinchToZoomPreparation2.ɵfac
  });
};
PinchToZoomPreparation = __decorate([FExecutionRegister(PinchToZoomPreparationRequest)], PinchToZoomPreparation);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PinchToZoomPreparation, [{
    type: Injectable
  }], null, null);
})();
var PINCH_TO_ZOOM_PROVIDERS = [PinchToZoomPreparation, PinchToZoomFinalize];
var SelectionAreaFinalizeRequest = class {
  event;
  static fToken = Symbol("SelectionAreaFinalizeRequest");
  constructor(event) {
    this.event = event;
  }
};
var SelectionAreaFinalize = class SelectionAreaFinalize2 {
  _dragSession = inject(FDraggableDataContext);
  handle(_request) {
    if (!this._isValid()) {
      return;
    }
    this._dragSession.draggableItems.forEach((x) => {
      x.onPointerUp?.();
    });
  }
  _isValid() {
    return this._dragSession.draggableItems.some((x) => x.getEvent().kind === "selection-area");
  }
  static ɵfac = function SelectionAreaFinalize_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SelectionAreaFinalize2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: SelectionAreaFinalize2,
    factory: SelectionAreaFinalize2.ɵfac
  });
};
SelectionAreaFinalize = __decorate([FExecutionRegister(SelectionAreaFinalizeRequest)], SelectionAreaFinalize);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SelectionAreaFinalize, [{
    type: Injectable
  }], null, null);
})();
var SelectionAreaHandler = class _SelectionAreaHandler extends DragHandlerBase {
  type = "selection-area";
  kind = "selection-area";
  _store = inject(FComponentsStore);
  _dragSession = inject(FDraggableDataContext);
  _mediator = inject(FMediator);
  _canBeSelected = [];
  _selectedByMove = [];
  get _transform() {
    return this._store.transform;
  }
  get _canvasPosition() {
    return Point.fromPoint(this._transform.position).add(this._transform.scaledPosition);
  }
  get _instance() {
    return this._store.instances.require(INSTANCES.SELECTION_AREA);
  }
  prepareDragSequence() {
    this._canBeSelected = this._mediator.execute(new CalculateSelectableItemsRequest());
    this._show();
    this._draw(RectExtensions.initialize(this._dragSession.onPointerDownPosition.x, this._dragSession.onPointerDownPosition.y));
  }
  onPointerMove(difference) {
    const currentPoint = Point.fromPoint(difference).add(this._dragSession.onPointerDownPosition);
    const point = this._getMinimumPoint(this._dragSession.onPointerDownPosition, currentPoint);
    const width = Math.abs(difference.x);
    const height = Math.abs(difference.y);
    const _selectionAreaRect = RectExtensions.initialize(point.x, point.y, width, height);
    this._draw(_selectionAreaRect);
    this._selectedByMove = [];
    this._canBeSelected.forEach((item) => {
      item.element.unmarkAsSelected();
      const _itemRect = RectExtensions.addPoint(RectExtensions.mult(item.fRect, this._transform.scale), this._canvasPosition);
      const isIntersect = RectExtensions.intersectionWithRect(_itemRect, _selectionAreaRect);
      if (isIntersect) {
        item.element.markAsSelected();
        this._selectedByMove.push(item.element);
      }
    });
    this._mediator.execute(new NotifyTransformChangedRequest());
  }
  _getMinimumPoint(point1, point2) {
    return PointExtensions.initialize(Math.min(point1.x, point2.x), Math.min(point1.y, point2.y));
  }
  onPointerUp() {
    this._hide();
    this._dragSession.selectedItems.push(...this._selectedByMove);
    if (this._selectedByMove.length > 0) {
      this._dragSession.isSelectedChanged = true;
    }
  }
  _draw(object) {
    const style = this._instance.hostElement.style;
    style.left = object.x + "px";
    style.top = object.y + "px";
    style.width = object.width + "px";
    style.height = object.height + "px";
  }
  _show() {
    this._instance.hostElement.style.display = "block";
  }
  _hide() {
    this._instance.hostElement.style.display = "none";
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSelectionAreaHandler_BaseFactory;
    return function SelectionAreaHandler_Factory(__ngFactoryType__) {
      return (ɵSelectionAreaHandler_BaseFactory || (ɵSelectionAreaHandler_BaseFactory = ɵɵgetInheritedFactory(_SelectionAreaHandler)))(__ngFactoryType__ || _SelectionAreaHandler);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _SelectionAreaHandler,
    factory: _SelectionAreaHandler.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SelectionAreaHandler, [{
    type: Injectable
  }], null, null);
})();
var SelectionAreaPreparationRequest = class {
  event;
  static fToken = Symbol("SelectionAreaPreparationRequest");
  constructor(event) {
    this.event = event;
  }
};
var SelectionAreaPreparation = class SelectionAreaPreparation2 {
  _store = inject(FComponentsStore);
  _dragSession = inject(FDraggableDataContext);
  _dragInjector = inject(DragHandlerInjector);
  get _instance() {
    return this._store.instances.get(INSTANCES.SELECTION_AREA);
  }
  handle(request) {
    if (!this._isValid(request)) {
      return;
    }
    this._dragSession.onPointerDownScale = 1;
    this._dragSession.onPointerDownPosition = Point.fromPoint(request.event.getPosition()).elementTransform(this._store.flowHost);
    this._dragSession.draggableItems = [this._dragInjector.createInstance(SelectionAreaHandler)];
  }
  _isValid(request) {
    return !!this._instance && this._dragSession.isEmpty() && isValidEventTrigger(request.event.originalEvent, this._instance.fTrigger);
  }
  static ɵfac = function SelectionAreaPreparation_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SelectionAreaPreparation2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: SelectionAreaPreparation2,
    factory: SelectionAreaPreparation2.ɵfac
  });
};
SelectionAreaPreparation = __decorate([FExecutionRegister(SelectionAreaPreparationRequest)], SelectionAreaPreparation);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SelectionAreaPreparation, [{
    type: Injectable
  }], null, null);
})();
var DRAG_SELECTION_AREA_PROVIDERS = [SelectionAreaPreparation, SelectionAreaFinalize];
var ApplyChildResizeConstraintsRequest = class {
  rect;
  childrenBounds;
  static fToken = Symbol("ApplyChildResizeConstraintsRequest");
  constructor(rect, childrenBounds) {
    this.rect = rect;
    this.childrenBounds = childrenBounds;
  }
};
var ApplyChildResizeConstraints = class ApplyChildResizeConstraints2 {
  handle({
    rect,
    childrenBounds
  }) {
    if (!childrenBounds) {
      return;
    }
    this._apply(rect, childrenBounds);
  }
  _apply(rect, restrictionsRect) {
    this._restrictLeft(rect, restrictionsRect);
    this._restrictTop(rect, restrictionsRect);
    this._restrictRight(rect, restrictionsRect);
    this._restrictBottom(rect, restrictionsRect);
    rect.width = Math.max(0, rect.width);
    rect.height = Math.max(0, rect.height);
  }
  _restrictLeft(rect, restrictions) {
    const delta = rect.x - restrictions.x;
    if (delta > 0) {
      rect.x -= delta;
      rect.width += delta;
    }
  }
  _restrictTop(rect, restrictions) {
    const delta = rect.y - restrictions.y;
    if (delta > 0) {
      rect.y -= delta;
      rect.height += delta;
    }
  }
  _restrictRight(rect, restrictions) {
    const maxRight = restrictions.x + restrictions.width;
    if (rect.x + rect.width <= maxRight) {
      rect.width = maxRight - rect.x;
    }
  }
  _restrictBottom(rect, restrictions) {
    const maxBottom = restrictions.y + restrictions.height;
    if (rect.y + rect.height <= maxBottom) {
      rect.height = maxBottom - rect.y;
    }
  }
  static ɵfac = function ApplyChildResizeConstraints_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ApplyChildResizeConstraints2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ApplyChildResizeConstraints2,
    factory: ApplyChildResizeConstraints2.ɵfac
  });
};
ApplyChildResizeConstraints = __decorate([FExecutionRegister(ApplyChildResizeConstraintsRequest)], ApplyChildResizeConstraints);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ApplyChildResizeConstraints, [{
    type: Injectable
  }], null, null);
})();
var ApplyParentResizeConstraintsRequest = class {
  rect;
  limits;
  static fToken = Symbol("ApplyParentResizeConstraintsRequest");
  constructor(rect, limits) {
    this.rect = rect;
    this.limits = limits;
  }
};
var ApplyParentResizeConstraints = class ApplyParentResizeConstraints2 {
  _mediator = inject(FMediator);
  /** Entry point: applies soft and hard resize constraints. */
  handle({
    rect,
    limits
  }) {
    this._applyResizeConstraints(rect, limits);
  }
  // ──────────────────────────────────────────────────────────────────────────────
  // Top–level orchestration
  // ──────────────────────────────────────────────────────────────────────────────
  _applyResizeConstraints(childRect, limits) {
    if (!limits) {
      return;
    }
    const childForCalc = this._clampedCopyForCalculation(childRect, limits);
    this._applySoftParentExpansions(childForCalc, limits.softLimits);
    if (limits.hardLimit) {
      this._clampRectToInner(childRect, limits.hardLimit.innerRect);
    }
  }
  // ──────────────────────────────────────────────────────────────────────────────
  // Hard-limit stage
  // ──────────────────────────────────────────────────────────────────────────────
  /** Returns a copy of the child rect pre-clamped to the hard innerRect if it exists. */
  _clampedCopyForCalculation(rect, limits) {
    const copy = __spreadValues({}, rect);
    if (limits.hardLimit) {
      this._clampRectToInner(copy, limits.hardLimit.innerRect);
    }
    return copy;
  }
  /** Clamps the rect inside the given innerRect. Mutates the rect directly. */
  _clampRectToInner(rect, inner) {
    if (rect.x < inner.x) {
      const diff = inner.x - rect.x;
      rect.x += diff;
      rect.width -= diff;
    }
    if (rect.y < inner.y) {
      const diff = inner.y - rect.y;
      rect.y += diff;
      rect.height -= diff;
    }
    const rightMax = inner.x + inner.width;
    if (rect.x + rect.width > rightMax) {
      rect.width = rightMax - rect.x;
    }
    const bottomMax = inner.y + inner.height;
    if (rect.y + rect.height > bottomMax) {
      rect.height = bottomMax - rect.y;
    }
    rect.width = Math.max(0, rect.width);
    rect.height = Math.max(0, rect.height);
  }
  // ──────────────────────────────────────────────────────────────────────────────
  // Soft-limit stage
  // ──────────────────────────────────────────────────────────────────────────────
  /** Iterates over all soft limits and applies expansion if overflow is detected. */
  _applySoftParentExpansions(childForCalc, softLimits) {
    if (!softLimits?.length) {
      return;
    }
    for (const limit of softLimits) {
      this._expandParentFromOriginalIfOverflow(childForCalc, limit);
    }
  }
  /**
   * If the child overflows the parent's innerRect, calculate a new parent rect
   * based on the original boundingRect and apply it. Otherwise, reset to original.
   */
  _expandParentFromOriginalIfOverflow(child, limit) {
    const inner = limit.innerRect;
    const original = limit.boundingRect;
    const overflow = this._computeOverflow(inner, child);
    if (!this._hasOverflow(overflow)) {
      this._applyParentRect(limit, original);
      return;
    }
    const nextParent = this._buildExpandedParentRect(original, overflow);
    this._applyParentRect(limit, nextParent);
  }
  /** Returns true if any overflow exists. */
  _hasOverflow(o) {
    return !!(o.left || o.top || o.right || o.bottom);
  }
  /** Computes overflow values for each side relative to innerRect. */
  _computeOverflow(inner, child) {
    const left = Math.max(0, inner.x - child.x);
    const top = Math.max(0, inner.y - child.y);
    const right = Math.max(0, child.x + child.width - (inner.x + inner.width));
    const bottom = Math.max(0, child.y + child.height - (inner.y + inner.height));
    return {
      left,
      top,
      right,
      bottom
    };
  }
  /** Builds new parent rect from original rect and overflow values. */
  _buildExpandedParentRect(original, o) {
    const parent = __spreadValues({}, original);
    if (o.left) {
      parent.x = original.x - o.left;
      parent.width = original.width + o.left;
    }
    if (o.top) {
      parent.y = original.y - o.top;
      parent.height = original.height + o.top;
    }
    if (o.right) {
      parent.width = (parent.width ?? original.width) + o.right;
    }
    if (o.bottom) {
      parent.height = (parent.height ?? original.height) + o.bottom;
    }
    return parent;
  }
  /** Applies the calculated parent rect to the node/group. */
  _applyParentRect(limit, rect) {
    limit.nodeOrGroup.updatePosition(rect);
    limit.nodeOrGroup.updateSize(rect);
    this._mediator.execute(new SetFCacheNodeRectRequest(limit.nodeOrGroup.fId(), rect));
    limit.nodeOrGroup.redraw();
  }
  static ɵfac = function ApplyParentResizeConstraints_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ApplyParentResizeConstraints2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ApplyParentResizeConstraints2,
    factory: ApplyParentResizeConstraints2.ɵfac
  });
};
ApplyParentResizeConstraints = __decorate([FExecutionRegister(ApplyParentResizeConstraintsRequest)], ApplyParentResizeConstraints);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ApplyParentResizeConstraints, [{
    type: Injectable
  }], null, null);
})();
var CalculateChangedRectFromDifferenceRequest = class {
  originalRect;
  difference;
  handleType;
  minimumSize;
  static fToken = Symbol("CalculateChangedRectFromDifferenceRequest");
  constructor(originalRect, difference, handleType, minimumSize) {
    this.originalRect = originalRect;
    this.difference = difference;
    this.handleType = handleType;
    this.minimumSize = minimumSize;
  }
};
var RESIZE_DIRECTIONS = {
  [EFResizeHandleType.LEFT]: {
    x: -1,
    y: 0
  },
  [EFResizeHandleType.LEFT_TOP]: {
    x: -1,
    y: -1
  },
  [EFResizeHandleType.TOP]: {
    x: 0,
    y: -1
  },
  [EFResizeHandleType.RIGHT_TOP]: {
    x: 1,
    y: -1
  },
  [EFResizeHandleType.RIGHT]: {
    x: 1,
    y: 0
  },
  [EFResizeHandleType.RIGHT_BOTTOM]: {
    x: 1,
    y: 1
  },
  [EFResizeHandleType.BOTTOM]: {
    x: 0,
    y: 1
  },
  [EFResizeHandleType.LEFT_BOTTOM]: {
    x: -1,
    y: 1
  }
};
var CalculateChangedRectFromDifference = class CalculateChangedRectFromDifference2 {
  handle({
    originalRect,
    difference,
    handleType,
    minimumSize
  }) {
    const changedRect = this._changeSizeInRect(originalRect, difference, RESIZE_DIRECTIONS[handleType], minimumSize);
    return this._changePosition(originalRect, difference, RESIZE_DIRECTIONS[handleType], changedRect);
  }
  _changeSizeInRect(originalRect, difference, direction, minimumSize) {
    let w = originalRect.width + direction.x * difference.x;
    let h = originalRect.height + direction.y * difference.y;
    let rx = 0;
    let ry = 0;
    if (w < 0) {
      rx = w;
      w = Math.abs(w);
    }
    if (w < minimumSize.width) {
      if (direction.x === -1) {
        rx += w - minimumSize.width;
      }
      w = minimumSize.width;
    }
    if (h < 0) {
      ry = h;
      h = Math.abs(h);
    }
    if (h < minimumSize.height) {
      if (direction.y === -1) {
        ry += h - minimumSize.height;
      }
      h = minimumSize.height;
    }
    return RectExtensions.initialize(rx, ry, w, h);
  }
  _changePosition(originalRect, difference, direction, changedRect) {
    const x = originalRect.x + (direction.x === -1 ? difference.x : 0) + changedRect.x;
    const y = originalRect.y + (direction.y === -1 ? difference.y : 0) + changedRect.y;
    return RectExtensions.initialize(x, y, changedRect.width, changedRect.height);
  }
  static ɵfac = function CalculateChangedRectFromDifference_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CalculateChangedRectFromDifference2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CalculateChangedRectFromDifference2,
    factory: CalculateChangedRectFromDifference2.ɵfac
  });
};
CalculateChangedRectFromDifference = __decorate([FExecutionRegister(CalculateChangedRectFromDifferenceRequest)], CalculateChangedRectFromDifference);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalculateChangedRectFromDifference, [{
    type: Injectable
  }], null, null);
})();
var CalculateDirectChildrenUnionRectRequest = class {
  nodeOrGroup;
  paddings;
  static fToken = Symbol("CalculateDirectChildrenUnionRectRequest");
  constructor(nodeOrGroup, paddings) {
    this.nodeOrGroup = nodeOrGroup;
    this.paddings = paddings;
  }
};
var CalculateDirectChildrenUnionRect = class CalculateDirectChildrenUnionRect2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  get _allNodesAndGroups() {
    return this._store.nodes.getAll();
  }
  handle({
    nodeOrGroup,
    paddings
  }) {
    const childNodeRect = RectExtensions.union(this._calculateDirectChildren(nodeOrGroup.fId()).map((x) => this._normalizeRect(x)));
    return childNodeRect ? this._concatRectWithParentPadding(childNodeRect, paddings) : null;
  }
  _calculateDirectChildren(nodeOrGroupId) {
    return this._allNodesAndGroups.filter((x) => x.fParentId() === nodeOrGroupId);
  }
  _normalizeRect(nodeOrGroup) {
    return this._mediator.execute(new GetNormalizedElementRectRequest(nodeOrGroup.hostElement));
  }
  _concatRectWithParentPadding(rect, padding) {
    return RectExtensions.initialize(rect.x - padding[0], rect.y - padding[1], rect.width + padding[0] + padding[2], rect.height + padding[1] + padding[3]);
  }
  static ɵfac = function CalculateDirectChildrenUnionRect_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CalculateDirectChildrenUnionRect2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CalculateDirectChildrenUnionRect2,
    factory: CalculateDirectChildrenUnionRect2.ɵfac
  });
};
CalculateDirectChildrenUnionRect = __decorate([FExecutionRegister(CalculateDirectChildrenUnionRectRequest)], CalculateDirectChildrenUnionRect);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalculateDirectChildrenUnionRect, [{
    type: Injectable
  }], null, null);
})();
var CalculateResizeLimitsRequest = class {
  nodeOrGroup;
  rect;
  static fToken = Symbol("CalculateResizeLimitsRequest");
  constructor(nodeOrGroup, rect) {
    this.nodeOrGroup = nodeOrGroup;
    this.rect = rect;
  }
};
var CalculateResizeLimits = class CalculateResizeLimits2 {
  _mediator = inject(FMediator);
  handle({
    nodeOrGroup,
    rect
  }) {
    const parents = this._getParentsChain(nodeOrGroup);
    const paddings = this._calculateNodePaddings(nodeOrGroup, rect);
    return {
      limits: this._buildSoftHardLimits(parents),
      childrenBounds: this._getNormalizedChildrenBounds(nodeOrGroup, paddings),
      minimumSize: SizeExtensions.initialize(paddings[0] + paddings[2], paddings[1] + paddings[3])
    };
  }
  _calculateNodePaddings(nodeOrGroup, rect) {
    return this._mediator.execute(new GetNodePaddingRequest(nodeOrGroup, rect));
  }
  _getNormalizedChildrenBounds(nodeOrGroup, paddings) {
    return this._mediator.execute(new CalculateDirectChildrenUnionRectRequest(nodeOrGroup, paddings));
  }
  _getParentsChain(nodeOrGroup) {
    return this._mediator.execute(new GetParentNodesRequest(nodeOrGroup)) ?? [];
  }
  _buildSoftHardLimits(parents) {
    const soft = [];
    let hard;
    let childrenPaddings = [0, 0, 0, 0];
    for (const parent of parents) {
      const parentInfo = this._getParentInfo(parent, childrenPaddings);
      childrenPaddings = parentInfo.paddings;
      if (this._isAutoExpand(parent)) {
        soft.push(this._makeLimit(parent, parentInfo));
      } else {
        hard = this._makeLimit(parent, parentInfo);
        break;
      }
    }
    return {
      softLimits: soft,
      hardLimit: hard
    };
  }
  _getParentInfo(parent, childrenPaddings) {
    return this._mediator.execute(new ReadNodeBoundsWithPaddingsRequest(parent, childrenPaddings));
  }
  _isAutoExpand(nodeOrGroup) {
    return nodeOrGroup.fAutoExpandOnChildHit();
  }
  _makeLimit(nodeOrGroup, {
    boundingRect,
    innerRect
  }) {
    return {
      nodeOrGroup,
      boundingRect,
      innerRect
    };
  }
  static ɵfac = function CalculateResizeLimits_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CalculateResizeLimits2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CalculateResizeLimits2,
    factory: CalculateResizeLimits2.ɵfac
  });
};
CalculateResizeLimits = __decorate([FExecutionRegister(CalculateResizeLimitsRequest)], CalculateResizeLimits);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalculateResizeLimits, [{
    type: Injectable
  }], null, null);
})();
var ResizeNodeFinalizeRequest = class {
  event;
  static fToken = Symbol("ResizeNodeFinalizeRequest");
  constructor(event) {
    this.event = event;
  }
};
var RESIZE_NODE_HANDLER_TYPE = "node-resize";
var RESIZE_NODE_HANDLER_KIND = "resize-node";
function isResizeNodeHandler(value) {
  return value.getEvent().kind === RESIZE_NODE_HANDLER_KIND || value.getEvent().fEventType === RESIZE_NODE_HANDLER_TYPE;
}
var ResizeNodeFinalize = class ResizeNodeFinalize2 {
  _dragSession = inject(FDraggableDataContext);
  handle(_request) {
    if (!this._isNodeResizeHandler()) {
      return;
    }
    this._dragSession.draggableItems.forEach((x) => x.onPointerUp?.());
  }
  _isNodeResizeHandler() {
    return this._dragSession.draggableItems.some((x) => isResizeNodeHandler(x));
  }
  static ɵfac = function ResizeNodeFinalize_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ResizeNodeFinalize2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ResizeNodeFinalize2,
    factory: ResizeNodeFinalize2.ɵfac
  });
};
ResizeNodeFinalize = __decorate([FExecutionRegister(ResizeNodeFinalizeRequest)], ResizeNodeFinalize);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResizeNodeFinalize, [{
    type: Injectable
  }], null, null);
})();
var FResizeNodeStartEventData = class {
  fNodeId;
  constructor(fNodeId) {
    this.fNodeId = fNodeId;
  }
};
var EFReflowMode;
(function(EFReflowMode2) {
  EFReflowMode2["CENTER_OF_MASS"] = "center-of-mass";
  EFReflowMode2["X_RANGE"] = "x-range";
  EFReflowMode2["DOWNSTREAM_CONNECTIONS"] = "downstream-connections";
})(EFReflowMode || (EFReflowMode = {}));
var EFReflowCollision;
(function(EFReflowCollision2) {
  EFReflowCollision2["STOP"] = "stop";
  EFReflowCollision2["CHAIN_PUSH"] = "chain-push";
})(EFReflowCollision || (EFReflowCollision = {}));
var EFReflowScope;
(function(EFReflowScope2) {
  EFReflowScope2["GLOBAL"] = "global";
  EFReflowScope2["GROUP"] = "group";
  EFReflowScope2["CONNECTED_SUBGRAPH"] = "connected-subgraph";
})(EFReflowScope || (EFReflowScope = {}));
var EFReflowAxis;
(function(EFReflowAxis2) {
  EFReflowAxis2["VERTICAL"] = "vertical";
  EFReflowAxis2["HORIZONTAL"] = "horizontal";
  EFReflowAxis2["BOTH"] = "both";
})(EFReflowAxis || (EFReflowAxis = {}));
var EFReflowDeltaSource;
(function(EFReflowDeltaSource2) {
  EFReflowDeltaSource2["EDGE_BASED"] = "edge-based";
  EFReflowDeltaSource2["CENTER_BASED"] = "center-based";
})(EFReflowDeltaSource || (EFReflowDeltaSource = {}));
var F_REFLOW_CONFIG = new InjectionToken("F_REFLOW_CONFIG");
var DEFAULT_CONFIG$1 = {
  enabled: true,
  mode: EFReflowMode.CENTER_OF_MASS,
  collision: EFReflowCollision.STOP,
  scope: EFReflowScope.GLOBAL,
  axis: EFReflowAxis.BOTH,
  deltaSource: EFReflowDeltaSource.EDGE_BASED,
  spacing: {
    vertical: 32,
    horizontal: 32
  },
  maxCascadeDepth: 8,
  maxAbsoluteShiftPerPlan: 1e4
};
function mergeReflowConfig(partial) {
  if (!partial) {
    return __spreadProps(__spreadValues({}, DEFAULT_CONFIG$1), {
      spacing: __spreadValues({}, DEFAULT_CONFIG$1.spacing)
    });
  }
  return {
    enabled: partial.enabled ?? DEFAULT_CONFIG$1.enabled,
    mode: partial.mode ?? DEFAULT_CONFIG$1.mode,
    collision: partial.collision ?? DEFAULT_CONFIG$1.collision,
    scope: partial.scope ?? DEFAULT_CONFIG$1.scope,
    axis: partial.axis ?? DEFAULT_CONFIG$1.axis,
    deltaSource: partial.deltaSource ?? DEFAULT_CONFIG$1.deltaSource,
    spacing: {
      vertical: partial.spacing?.vertical ?? DEFAULT_CONFIG$1.spacing.vertical,
      horizontal: partial.spacing?.horizontal ?? DEFAULT_CONFIG$1.spacing.horizontal
    },
    maxCascadeDepth: partial.maxCascadeDepth ?? DEFAULT_CONFIG$1.maxCascadeDepth,
    maxAbsoluteShiftPerPlan: partial.maxAbsoluteShiftPerPlan ?? DEFAULT_CONFIG$1.maxAbsoluteShiftPerPlan
  };
}
var EMPTY_REFLOW_PLAN = (sourceNodeId) => ({
  sourceNodeId,
  shifts: [],
  deltaEdges: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
});
function computeEdgeDeltas(baseline, next) {
  return {
    top: baseline.y - next.y,
    right: next.x + next.width - (baseline.x + baseline.width),
    bottom: next.y + next.height - (baseline.y + baseline.height),
    left: baseline.x - next.x
  };
}
var EdgeBasedDeltaCalculator = class {
  calculate({
    baselineRect,
    nextRect,
    candidateRect,
    axis
  }) {
    const deltas = computeEdgeDeltas(baselineRect, nextRect);
    const dy = axis === EFReflowAxis.VERTICAL || axis === EFReflowAxis.BOTH ? this._verticalShift(deltas, baselineRect, nextRect, candidateRect) : 0;
    const dx = axis === EFReflowAxis.HORIZONTAL || axis === EFReflowAxis.BOTH ? this._horizontalShift(deltas, baselineRect, nextRect, candidateRect) : 0;
    if (dx === 0 && dy === 0) {
      return null;
    }
    return {
      x: dx,
      y: dy
    };
  }
  _verticalShift(deltas, baseline, next, candidate) {
    const baselineBottom = baseline.y + baseline.height;
    const baselineTop = baseline.y;
    const nextBottom = next.y + next.height;
    const nextTop = next.y;
    const candidateTop = candidate.y;
    const candidateBottom = candidate.y + candidate.height;
    if (deltas.bottom > 0 && candidateTop >= baselineBottom) {
      return deltas.bottom;
    }
    if (deltas.bottom < 0 && candidateTop >= nextBottom) {
      return deltas.bottom;
    }
    if (deltas.top > 0 && candidateBottom <= baselineTop) {
      return -deltas.top;
    }
    if (deltas.top < 0 && candidateBottom <= nextTop) {
      return -deltas.top;
    }
    return 0;
  }
  _horizontalShift(deltas, baseline, next, candidate) {
    const baselineRight = baseline.x + baseline.width;
    const baselineLeft = baseline.x;
    const nextRight = next.x + next.width;
    const nextLeft = next.x;
    const candidateLeft = candidate.x;
    const candidateRight = candidate.x + candidate.width;
    if (deltas.right > 0 && candidateLeft >= baselineRight) {
      return deltas.right;
    }
    if (deltas.right < 0 && candidateLeft >= nextRight) {
      return deltas.right;
    }
    if (deltas.left > 0 && candidateRight <= baselineLeft) {
      return -deltas.left;
    }
    if (deltas.left < 0 && candidateRight <= nextLeft) {
      return -deltas.left;
    }
    return 0;
  }
};
var CenterBasedDeltaCalculator = class {
  calculate({
    baselineRect,
    nextRect,
    candidateRect,
    axis
  }) {
    const dy = axis === EFReflowAxis.VERTICAL || axis === EFReflowAxis.BOTH ? this._verticalShift(baselineRect, nextRect, candidateRect) : 0;
    const dx = axis === EFReflowAxis.HORIZONTAL || axis === EFReflowAxis.BOTH ? this._horizontalShift(baselineRect, nextRect, candidateRect) : 0;
    if (dx === 0 && dy === 0) {
      return null;
    }
    return {
      x: dx,
      y: dy
    };
  }
  _verticalShift(baseline, next, candidate) {
    const deltaHeight = next.height - baseline.height;
    if (deltaHeight === 0) {
      return 0;
    }
    const baselineCenterY = baseline.y + baseline.height / 2;
    const candidateCenterY = candidate.y + candidate.height / 2;
    if (deltaHeight > 0 && candidateCenterY > baselineCenterY) {
      return deltaHeight;
    }
    if (deltaHeight < 0 && candidateCenterY > baselineCenterY) {
      return deltaHeight;
    }
    return 0;
  }
  _horizontalShift(baseline, next, candidate) {
    const deltaWidth = next.width - baseline.width;
    if (deltaWidth === 0) {
      return 0;
    }
    const baselineCenterX = baseline.x + baseline.width / 2;
    const candidateCenterX = candidate.x + candidate.width / 2;
    if (deltaWidth > 0 && candidateCenterX > baselineCenterX) {
      return deltaWidth;
    }
    if (deltaWidth < 0 && candidateCenterX > baselineCenterX) {
      return deltaWidth;
    }
    return 0;
  }
};
var CenterOfMassSelectionStrategy = class {
  select({
    sourceId,
    candidates
  }) {
    return candidates.filter((candidate) => candidate.id !== sourceId);
  }
};
var XRangeSelectionStrategy = class {
  select({
    sourceId,
    sourceBaselineRect,
    sourceNextRect,
    candidates,
    axis
  }) {
    return candidates.filter((c) => {
      if (c.id === sourceId) return false;
      switch (axis) {
        case EFReflowAxis.VERTICAL:
          return this._overlapsX(c.rect, sourceBaselineRect) || this._overlapsX(c.rect, sourceNextRect);
        case EFReflowAxis.HORIZONTAL:
          return this._overlapsY(c.rect, sourceBaselineRect) || this._overlapsY(c.rect, sourceNextRect);
        case EFReflowAxis.BOTH:
        default:
          return this._overlapsX(c.rect, sourceBaselineRect) || this._overlapsX(c.rect, sourceNextRect) || this._overlapsY(c.rect, sourceBaselineRect) || this._overlapsY(c.rect, sourceNextRect);
      }
    });
  }
  _overlapsX(a, b) {
    return !(a.x + a.width <= b.x || b.x + b.width <= a.x);
  }
  _overlapsY(a, b) {
    return !(a.y + a.height <= b.y || b.y + b.height <= a.y);
  }
};
var FReflowCycleGuard = class {
  _maxDepth;
  _visited = /* @__PURE__ */ new Set();
  constructor(_maxDepth) {
    this._maxDepth = _maxDepth;
  }
  visit(id) {
    if (this._visited.has(id)) return false;
    if (this._visited.size >= this._maxDepth) return false;
    this._visited.add(id);
    return true;
  }
  has(id) {
    return this._visited.has(id);
  }
  size() {
    return this._visited.size;
  }
};
var DownstreamConnectionsSelectionStrategy = class {
  _maxCascadeDepth;
  constructor(_maxCascadeDepth) {
    this._maxCascadeDepth = _maxCascadeDepth;
  }
  select({
    sourceId,
    candidates,
    connections
  }) {
    const downstream = /* @__PURE__ */ new Set();
    const guard = new FReflowCycleGuard(this._maxCascadeDepth);
    const queue = [sourceId];
    const adjacency = this._buildAdjacency(connections);
    while (queue.length > 0) {
      const current = queue.shift();
      if (!guard.visit(current)) continue;
      const next = adjacency.get(current);
      if (!next) continue;
      for (const nextId of next) {
        if (downstream.has(nextId) || nextId === sourceId) continue;
        downstream.add(nextId);
        queue.push(nextId);
      }
    }
    return candidates.filter((c) => c.id !== sourceId && downstream.has(c.id));
  }
  _buildAdjacency(connections) {
    const map = /* @__PURE__ */ new Map();
    for (const conn of connections) {
      const list = map.get(conn.outputNodeId);
      if (list) list.push(conn.inputNodeId);
      else map.set(conn.outputNodeId, [conn.inputNodeId]);
    }
    return map;
  }
};
var GlobalScopeFilter = class {
  filter({
    candidates
  }) {
    return candidates;
  }
};
var GroupScopeFilter = class {
  filter({
    sourceCandidate,
    candidates
  }) {
    const sourceParentId = sourceCandidate?.parentId ?? null;
    return candidates.filter((c) => (c.parentId ?? null) === sourceParentId);
  }
};
var ConnectedSubgraphScopeFilter = class {
  filter({
    sourceCandidate,
    candidates,
    connections
  }) {
    if (!sourceCandidate) return candidates;
    const adjacency = this._buildBidirectionalAdjacency(connections);
    const reachable = this._bfs(sourceCandidate.id, adjacency);
    return candidates.filter((c) => reachable.has(c.id));
  }
  _buildBidirectionalAdjacency(connections) {
    const map = /* @__PURE__ */ new Map();
    const add = (a, b) => {
      const list = map.get(a);
      if (list) list.push(b);
      else map.set(a, [b]);
    };
    for (const conn of connections) {
      add(conn.outputNodeId, conn.inputNodeId);
      add(conn.inputNodeId, conn.outputNodeId);
    }
    return map;
  }
  _bfs(start, adjacency) {
    const visited = /* @__PURE__ */ new Set([start]);
    const queue = [start];
    while (queue.length > 0) {
      const current = queue.shift();
      const next = adjacency.get(current);
      if (!next) continue;
      for (const id of next) {
        if (visited.has(id)) continue;
        visited.add(id);
        queue.push(id);
      }
    }
    return visited;
  }
};
var StopCollisionResolver = class {
  resolve({
    sourceNextRect,
    rawShifts,
    pool,
    spacing,
    maxAbsoluteShift
  }) {
    const shiftingIds = new Set(rawShifts.map((s) => s.candidate.id));
    const obstacles = pool.filter((c) => !shiftingIds.has(c.id)).map((c) => c.rect);
    void sourceNextRect;
    const resolved = [];
    for (const raw of rawShifts) {
      const rect = raw.candidate.rect;
      let dx = raw.shift.x;
      let dy = raw.shift.y;
      if (dy !== 0) {
        dy = this._clampVerticalShift(rect, dy, obstacles, spacing.vertical);
      }
      if (dx !== 0) {
        dx = this._clampHorizontalShift(rect, dx, obstacles, spacing.horizontal);
      }
      dx = this._clampAbs(dx, maxAbsoluteShift);
      dy = this._clampAbs(dy, maxAbsoluteShift);
      if (dx === 0 && dy === 0) {
        continue;
      }
      const toRect = RectExtensions.initialize(rect.x + dx, rect.y + dy, rect.width, rect.height);
      resolved.push({
        candidate: raw.candidate,
        fromRect: rect,
        toRect,
        toPosition: {
          x: rect.x + dx,
          y: rect.y + dy
        }
      });
    }
    return resolved;
  }
  _clampVerticalShift(rect, dy, obstacles, spacing) {
    if (dy > 0) {
      let maxDy = dy;
      for (const obs of obstacles) {
        if (!this._overlapsOnX(rect, obs)) continue;
        if (obs.y < rect.y + rect.height) continue;
        const availableGap = obs.y - (rect.y + rect.height);
        const maxForThis = Math.max(0, availableGap - spacing);
        if (maxForThis < maxDy) maxDy = maxForThis;
      }
      return maxDy;
    }
    let minDy = dy;
    for (const obs of obstacles) {
      if (!this._overlapsOnX(rect, obs)) continue;
      if (obs.y + obs.height > rect.y) continue;
      const availableGap = rect.y - (obs.y + obs.height);
      const minForThis = Math.min(0, -(availableGap - spacing));
      if (minForThis > minDy) minDy = minForThis;
    }
    return minDy;
  }
  _clampHorizontalShift(rect, dx, obstacles, spacing) {
    if (dx > 0) {
      let maxDx = dx;
      for (const obs of obstacles) {
        if (!this._overlapsOnY(rect, obs)) continue;
        if (obs.x < rect.x + rect.width) continue;
        const availableGap = obs.x - (rect.x + rect.width);
        const maxForThis = Math.max(0, availableGap - spacing);
        if (maxForThis < maxDx) maxDx = maxForThis;
      }
      return maxDx;
    }
    let minDx = dx;
    for (const obs of obstacles) {
      if (!this._overlapsOnY(rect, obs)) continue;
      if (obs.x + obs.width > rect.x) continue;
      const availableGap = rect.x - (obs.x + obs.width);
      const minForThis = Math.min(0, -(availableGap - spacing));
      if (minForThis > minDx) minDx = minForThis;
    }
    return minDx;
  }
  _overlapsOnX(a, b) {
    return !(a.x + a.width <= b.x || b.x + b.width <= a.x);
  }
  _overlapsOnY(a, b) {
    return !(a.y + a.height <= b.y || b.y + b.height <= a.y);
  }
  _clampAbs(value, max) {
    if (value > max) return max;
    if (value < -max) return -max;
    return value;
  }
};
var ChainPushCollisionResolver = class {
  _maxCascadeDepth;
  constructor(_maxCascadeDepth) {
    this._maxCascadeDepth = _maxCascadeDepth;
  }
  resolve({
    rawShifts,
    pool,
    spacing,
    maxAbsoluteShift
  }) {
    const shifts = /* @__PURE__ */ new Map();
    for (const raw of rawShifts) {
      const dx = this._clampAbs(raw.shift.x, maxAbsoluteShift);
      const dy = this._clampAbs(raw.shift.y, maxAbsoluteShift);
      if (dx === 0 && dy === 0) continue;
      shifts.set(raw.candidate.id, {
        candidate: raw.candidate,
        dx,
        dy,
        toRect: this._shifted(raw.candidate.rect, dx, dy)
      });
    }
    let depth = 0;
    let changed = true;
    while (changed && depth < this._maxCascadeDepth) {
      changed = false;
      depth++;
      for (const entry of [...shifts.values()]) {
        for (const candidate of pool) {
          if (shifts.has(candidate.id)) continue;
          const push = this._computePush(entry.toRect, candidate.rect, spacing);
          if (!push) continue;
          const dx = this._clampAbs(push.dx, maxAbsoluteShift);
          const dy = this._clampAbs(push.dy, maxAbsoluteShift);
          if (dx === 0 && dy === 0) continue;
          shifts.set(candidate.id, {
            candidate,
            dx,
            dy,
            toRect: this._shifted(candidate.rect, dx, dy)
          });
          changed = true;
        }
      }
    }
    const resolved = [];
    for (const entry of shifts.values()) {
      resolved.push({
        candidate: entry.candidate,
        fromRect: entry.candidate.rect,
        toRect: entry.toRect,
        toPosition: {
          x: entry.toRect.x,
          y: entry.toRect.y
        }
      });
    }
    return resolved;
  }
  /**
   * If `mover` (already shifted) overlaps `target` (stationary) below
   * the configured per-axis spacing, return the displacement that would
   * restore that spacing. The push direction is determined by which
   * edge of the mover is impinging on the target.
   */
  _computePush(mover, target, spacing) {
    let dx = 0;
    let dy = 0;
    if (this._overlapsX(mover, target)) {
      const moverBottom = mover.y + mover.height;
      const targetBottom = target.y + target.height;
      if (moverBottom + spacing.vertical > target.y && mover.y < targetBottom) {
        if (mover.y < target.y) {
          dy = moverBottom + spacing.vertical - target.y;
        } else {
          dy = mover.y - targetBottom - spacing.vertical;
        }
      }
    }
    if (this._overlapsY(mover, target)) {
      const moverRight = mover.x + mover.width;
      const targetRight = target.x + target.width;
      if (moverRight + spacing.horizontal > target.x && mover.x < targetRight) {
        if (mover.x < target.x) {
          dx = moverRight + spacing.horizontal - target.x;
        } else {
          dx = mover.x - targetRight - spacing.horizontal;
        }
      }
    }
    if (dx === 0 && dy === 0) return null;
    return {
      dx,
      dy
    };
  }
  _shifted(rect, dx, dy) {
    return RectExtensions.initialize(rect.x + dx, rect.y + dy, rect.width, rect.height);
  }
  _overlapsX(a, b) {
    return !(a.x + a.width <= b.x || b.x + b.width <= a.x);
  }
  _overlapsY(a, b) {
    return !(a.y + a.height <= b.y || b.y + b.height <= a.y);
  }
  _clampAbs(value, max) {
    if (value > max) return max;
    if (value < -max) return -max;
    return value;
  }
};
var FReflowPlanner = class _FReflowPlanner {
  _edgeBased = new EdgeBasedDeltaCalculator();
  _centerBased = new CenterBasedDeltaCalculator();
  _centerOfMassSelection = new CenterOfMassSelectionStrategy();
  _xRangeSelection = new XRangeSelectionStrategy();
  _globalScope = new GlobalScopeFilter();
  _groupScope = new GroupScopeFilter();
  _connectedSubgraphScope = new ConnectedSubgraphScopeFilter();
  _stopCollision = new StopCollisionResolver();
  plan(input2) {
    const {
      sourceId,
      baselineRect,
      nextRect,
      candidates,
      connections,
      config
    } = input2;
    if (this._isNoOpDelta(baselineRect, nextRect)) {
      return EMPTY_REFLOW_PLAN(sourceId);
    }
    const selection = this._resolveSelection(config.mode, config);
    if (!selection) {
      return EMPTY_REFLOW_PLAN(sourceId);
    }
    const scopeFilter = this._resolveScope(config.scope);
    if (!scopeFilter) {
      return EMPTY_REFLOW_PLAN(sourceId);
    }
    const collisionResolver = this._resolveCollision(config.collision, config);
    if (!collisionResolver) {
      return EMPTY_REFLOW_PLAN(sourceId);
    }
    const deltaCalculator = this._resolveDeltaCalculator(config.deltaSource);
    const eligible = this._excludeSourceAncestorsAndDescendants(candidates, sourceId);
    const preselected = selection.select({
      sourceId,
      sourceBaselineRect: baselineRect,
      sourceNextRect: nextRect,
      candidates: eligible,
      connections,
      axis: config.axis
    });
    const sourceCandidate = candidates.find((c) => c.id === sourceId) ?? null;
    const scoped = scopeFilter.filter({
      sourceCandidate,
      candidates: preselected,
      connections
    });
    const rawShifts = this._computeRawShifts(deltaCalculator, scoped, baselineRect, nextRect, config);
    const containedShifts = this._clampToParentBounds(rawShifts, candidates);
    if (containedShifts.length === 0) {
      return {
        sourceNodeId: sourceId,
        shifts: [],
        deltaEdges: computeEdgeDeltas(baselineRect, nextRect)
      };
    }
    const resolved = collisionResolver.resolve({
      sourceNextRect: nextRect,
      rawShifts: containedShifts,
      // Collision pool follows the user's scope. Out-of-scope nodes are
      // off-limits to the plan — they must not become stationary
      // obstacles a shift slams into (STOP) and must not be absorbed
      // into the cascade (CHAIN_PUSH). With the pool restricted to
      // `scoped`, the chosen scope semantically owns both who moves and
      // what counts as solid.
      //
      // Anchored nodes (`fReflowIgnore`) stay in the pool: they never
      // get a primary shift (filtered out in `_computeRawShifts`), but
      // they must still register as obstacles so STOP clamps against
      // them and CHAIN_PUSH treats them as something to push past.
      pool: scoped,
      spacing: config.spacing,
      maxAbsoluteShift: config.maxAbsoluteShiftPerPlan
    });
    return {
      sourceNodeId: sourceId,
      shifts: resolved.map((r) => ({
        id: r.candidate.id,
        fromRect: r.fromRect,
        toRect: r.toRect,
        toPosition: r.toPosition
      })),
      deltaEdges: computeEdgeDeltas(baselineRect, nextRect)
    };
  }
  /**
   * Clamps each candidate's shift so the post-shift rect cannot extend
   * past its parent's outer bounds. The parent's edges act as walls —
   * a shift that would carry a sibling outside the group is reduced to
   * land flush against the inside edge.
   *
   * Top-level candidates (no parent) pass through unchanged. Spacing is
   * intentionally not applied here: that is a between-nodes concern and
   * is handled by the collision resolver against fellow shifts. Adding
   * spacing here would also fight any candidate whose original position
   * is already on or past the parent's edge.
   */
  _clampToParentBounds(shifts, candidates) {
    const byId = new Map(candidates.map((c) => [c.id, c]));
    const result = [];
    for (const raw of shifts) {
      const cand = raw.candidate;
      const parent = cand.parentId ? byId.get(cand.parentId) : null;
      if (!parent) {
        result.push(raw);
        continue;
      }
      const minX = parent.rect.x;
      const maxX = parent.rect.x + parent.rect.width - cand.rect.width;
      const minY = parent.rect.y;
      const maxY = parent.rect.y + parent.rect.height - cand.rect.height;
      const targetX = cand.rect.x + raw.shift.x;
      const targetY = cand.rect.y + raw.shift.y;
      const clampedX = Math.max(minX, Math.min(maxX, targetX));
      const clampedY = Math.max(minY, Math.min(maxY, targetY));
      const dx = clampedX - cand.rect.x;
      const dy = clampedY - cand.rect.y;
      if (dx === 0 && dy === 0) continue;
      result.push({
        candidate: cand,
        shift: {
          x: dx,
          y: dy
        }
      });
    }
    return result;
  }
  /**
   * Returns candidates with the source itself, the source's full parent
   * chain, and the source's descendant subtree all removed. Cycle-safe
   * via visited sets so malformed parent links cannot loop forever.
   */
  _excludeSourceAncestorsAndDescendants(candidates, sourceId) {
    const byId = /* @__PURE__ */ new Map();
    const childrenOf = /* @__PURE__ */ new Map();
    for (const c of candidates) {
      byId.set(c.id, c);
      const pid = c.parentId ?? null;
      if (pid) {
        const list = childrenOf.get(pid) ?? [];
        list.push(c.id);
        childrenOf.set(pid, list);
      }
    }
    const blocked = /* @__PURE__ */ new Set([sourceId]);
    let cursor = byId.get(sourceId)?.parentId ?? null;
    const visitedAncestors = /* @__PURE__ */ new Set();
    while (cursor && !visitedAncestors.has(cursor)) {
      visitedAncestors.add(cursor);
      blocked.add(cursor);
      cursor = byId.get(cursor)?.parentId ?? null;
    }
    const queue = [...childrenOf.get(sourceId) ?? []];
    const visitedDescendants = /* @__PURE__ */ new Set();
    while (queue.length > 0) {
      const id = queue.shift();
      if (visitedDescendants.has(id)) continue;
      visitedDescendants.add(id);
      blocked.add(id);
      for (const child of childrenOf.get(id) ?? []) {
        queue.push(child);
      }
    }
    return candidates.filter((c) => !blocked.has(c.id));
  }
  /**
   * Reflow reacts to SIZE changes only. A pure translation (position
   * changed, size unchanged) must not generate shifts — doing so would
   * cascade through every candidate that was just shifted, since each
   * shift re-enters this path via `stateChanges.notify()` in
   * `FNodeDirective.refresh()`.
   */
  _isNoOpDelta(baseline, next) {
    return baseline.width === next.width && baseline.height === next.height;
  }
  _resolveSelection(mode, config) {
    switch (mode) {
      case EFReflowMode.CENTER_OF_MASS:
        return this._centerOfMassSelection;
      case EFReflowMode.X_RANGE:
        return this._xRangeSelection;
      case EFReflowMode.DOWNSTREAM_CONNECTIONS:
        return new DownstreamConnectionsSelectionStrategy(config.maxCascadeDepth);
      default:
        return null;
    }
  }
  _resolveScope(scope) {
    switch (scope) {
      case EFReflowScope.GLOBAL:
        return this._globalScope;
      case EFReflowScope.GROUP:
        return this._groupScope;
      case EFReflowScope.CONNECTED_SUBGRAPH:
        return this._connectedSubgraphScope;
      default:
        return null;
    }
  }
  _resolveCollision(collision, config) {
    switch (collision) {
      case EFReflowCollision.STOP:
        return this._stopCollision;
      case EFReflowCollision.CHAIN_PUSH:
        return new ChainPushCollisionResolver(config.maxCascadeDepth);
      default:
        return null;
    }
  }
  _resolveDeltaCalculator(source) {
    return source === EFReflowDeltaSource.CENTER_BASED ? this._centerBased : this._edgeBased;
  }
  _computeRawShifts(calculator, candidates, baselineRect, nextRect, config) {
    const shifts = [];
    for (const candidate of candidates) {
      if (candidate.isIgnored) continue;
      const shift = calculator.calculate({
        baselineRect,
        nextRect,
        candidateRect: candidate.rect,
        axis: config.axis
      });
      if (shift !== null) {
        shifts.push({
          candidate,
          shift
        });
      }
    }
    return shifts;
  }
  static ɵfac = function FReflowPlanner_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FReflowPlanner)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _FReflowPlanner,
    factory: _FReflowPlanner.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FReflowPlanner, [{
    type: Injectable
  }], null, null);
})();
var FReflowController = class _FReflowController {
  _initial = inject(F_REFLOW_CONFIG, {
    optional: true
  });
  _featureActivated = this._initial !== null;
  _config = signal(this._initial ?? mergeReflowConfig(void 0), ...ngDevMode ? [{
    debugName: "_config"
  }] : []);
  config = this._config.asReadonly();
  isEnabled = computed(() => this._featureActivated && this._config().enabled, ...ngDevMode ? [{
    debugName: "isEnabled"
  }] : []);
  getConfig() {
    return this._config();
  }
  setConfig(partial) {
    this._config.set(mergeReflowConfig(__spreadValues(__spreadValues({}, this._config()), partial)));
  }
  static ɵfac = function FReflowController_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FReflowController)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _FReflowController,
    factory: _FReflowController.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FReflowController, [{
    type: Injectable
  }], null, null);
})();
var FReflowIgnoreRegistry = class _FReflowIgnoreRegistry {
  _ignored = /* @__PURE__ */ new Set();
  add(id) {
    this._ignored.add(id);
  }
  remove(id) {
    this._ignored.delete(id);
  }
  has(id) {
    return this._ignored.has(id);
  }
  static ɵfac = function FReflowIgnoreRegistry_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FReflowIgnoreRegistry)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _FReflowIgnoreRegistry,
    factory: _FReflowIgnoreRegistry.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FReflowIgnoreRegistry, [{
    type: Injectable
  }], null, null);
})();
var FReflowBaselineTracker = class _FReflowBaselineTracker {
  _baselines = /* @__PURE__ */ new Map();
  get(id) {
    return this._baselines.get(id);
  }
  set(id, rect) {
    this._baselines.set(id, rect);
  }
  delete(id) {
    this._baselines.delete(id);
  }
  clear() {
    this._baselines.clear();
  }
  static ɵfac = function FReflowBaselineTracker_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FReflowBaselineTracker)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _FReflowBaselineTracker,
    factory: _FReflowBaselineTracker.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FReflowBaselineTracker, [{
    type: Injectable
  }], null, null);
})();
var FReflowOrchestrator = class _FReflowOrchestrator {
  _controller = inject(FReflowController, {
    optional: true
  });
  _store = inject(FComponentsStore);
  _mediator = inject(FMediator);
  _ignoreRegistry = inject(FReflowIgnoreRegistry);
  _planner = inject(FReflowPlanner);
  _tracker = inject(FReflowBaselineTracker);
  handleResize(sourceNode, baselineRect) {
    if (!this._controller?.isEnabled()) {
      return;
    }
    const sourceId = sourceNode.fId();
    const nextRect = this._safeGetRect(sourceNode);
    if (!nextRect) {
      return;
    }
    if (!sourceNode.hostElement?.isConnected || nextRect.width === 0 || nextRect.height === 0) {
      this._tracker.delete(sourceId);
      return;
    }
    let baseline = baselineRect;
    if (!baseline) {
      const tracked = this._tracker.get(sourceId);
      if (tracked) {
        baseline = {
          x: nextRect.x,
          y: nextRect.y,
          width: tracked.width,
          height: tracked.height,
          gravityCenter: {
            x: nextRect.x + tracked.width / 2,
            y: nextRect.y + tracked.height / 2
          }
        };
      }
    }
    this._tracker.set(sourceId, nextRect);
    if (!baseline) {
      return;
    }
    const candidates = this._buildCandidates();
    const connections = this._buildConnections();
    const config = this._controller.getConfig();
    const plan = this._planner.plan({
      sourceId,
      baselineRect: baseline,
      nextRect,
      candidates,
      connections,
      config
    });
    if (plan.shifts.length === 0) {
      return;
    }
    const moved = [];
    for (const shift of plan.shifts) {
      const node = this._store.nodes.get(shift.id);
      if (!node || !node.hostElement?.isConnected) {
        continue;
      }
      const pos = {
        x: shift.toPosition.x,
        y: shift.toPosition.y
      };
      node.position.set(pos);
      this._tracker.set(shift.id, shift.toRect);
      moved.push({
        id: shift.id,
        position: pos
      });
    }
    if (moved.length > 0) {
      this._store.fDraggable?.fMoveNodes.emit(new FMoveNodesEvent(moved));
    }
  }
  _buildCandidates() {
    const result = [];
    for (const node of this._store.nodes.getAll()) {
      const id = node.fId();
      const rect = this._safeGetRect(node);
      if (!rect) continue;
      result.push({
        id,
        rect,
        parentId: node.fParentId(),
        isIgnored: this._ignoreRegistry.has(id)
      });
    }
    return result;
  }
  /**
   * Resolves f-flow's connector-keyed connections down to node-to-node
   * links so graph-based selection strategies (DOWNSTREAM) can BFS
   * without walking the connector registry themselves.
   */
  _buildConnections() {
    const connectorToNode = /* @__PURE__ */ new Map();
    for (const node of this._store.nodes.getAll()) {
      const nodeId = node.fId();
      for (const connector of node.connectors) {
        connectorToNode.set(connector.fId(), nodeId);
      }
    }
    const result = [];
    for (const conn of this._store.connections.getAll()) {
      const outputNodeId = connectorToNode.get(conn.fOutputId());
      const inputNodeId = connectorToNode.get(conn.fInputId());
      if (!outputNodeId || !inputNodeId) continue;
      result.push({
        outputNodeId,
        inputNodeId
      });
    }
    return result;
  }
  _safeGetRect(node) {
    if (!node.hostElement) {
      return null;
    }
    try {
      return this._mediator.execute(new GetNormalizedElementRectRequest(node.hostElement));
    } catch {
      return null;
    }
  }
  static ɵfac = function FReflowOrchestrator_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FReflowOrchestrator)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _FReflowOrchestrator,
    factory: _FReflowOrchestrator.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FReflowOrchestrator, [{
    type: Injectable
  }], null, null);
})();
var FReflowIgnore = class _FReflowIgnore {
  fReflowIgnore = input(true, ...ngDevMode ? [{
    debugName: "fReflowIgnore",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]);
  _registry = inject(FReflowIgnoreRegistry);
  _node = inject(F_NODE);
  _injector = inject(Injector);
  ngOnInit() {
    effect(() => {
      const id = this._node.fId();
      const shouldIgnore = this.fReflowIgnore();
      untracked(() => {
        if (shouldIgnore) {
          this._registry.add(id);
        } else {
          this._registry.remove(id);
        }
      });
    }, {
      injector: this._injector
    });
  }
  ngOnDestroy() {
    this._registry.remove(this._node.fId());
  }
  static ɵfac = function FReflowIgnore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FReflowIgnore)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FReflowIgnore,
    selectors: [["", "fReflowIgnore", ""]],
    inputs: {
      fReflowIgnore: [1, "fReflowIgnore"]
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FReflowIgnore, [{
    type: Directive,
    args: [{
      selector: "[fReflowIgnore]",
      standalone: true
    }]
  }], null, {
    fReflowIgnore: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fReflowIgnore",
        required: false
      }]
    }]
  });
})();
var F_REFLOW_PROVIDERS = [FReflowPlanner, FReflowOrchestrator, FReflowIgnoreRegistry, FReflowBaselineTracker];
var F_FLOW_CONFIG = new InjectionToken("F_FLOW_CONFIG");
var EFFlowFeatureKind;
(function(EFFlowFeatureKind2) {
  EFFlowFeatureKind2["REFLOW_ON_RESIZE"] = "reflow-on-resize";
  EFFlowFeatureKind2["CANVAS"] = "canvas";
})(EFFlowFeatureKind || (EFFlowFeatureKind = {}));
function provideFFlow(configOrFeature, ...rest) {
  const {
    config,
    features
  } = _normalizeArgs(configOrFeature, rest);
  const providers = [{
    provide: F_FLOW_CONFIG,
    useValue: config
  }];
  for (const feature of features) {
    providers.push(...feature.providers);
  }
  return providers;
}
function _normalizeArgs(first, rest) {
  if (first === void 0) {
    return {
      config: {},
      features: rest
    };
  }
  if (_isFeature(first)) {
    return {
      config: {},
      features: [first, ...rest]
    };
  }
  return {
    config: first,
    features: rest
  };
}
function _isFeature(value) {
  return typeof value.kind === "string";
}
function withReflowOnResize(config) {
  return {
    kind: EFFlowFeatureKind.REFLOW_ON_RESIZE,
    providers: [{
      provide: F_REFLOW_CONFIG,
      useValue: mergeReflowConfig(config)
    }, FReflowController]
  };
}
var ResizeNodeHandler = class _ResizeNodeHandler extends DragHandlerBase {
  type = RESIZE_NODE_HANDLER_TYPE;
  kind = RESIZE_NODE_HANDLER_KIND;
  data() {
    return new FResizeNodeStartEventData(this._nodeOrGroup.fId());
  }
  _mediator = inject(FMediator);
  _reflowOrchestrator = inject(FReflowOrchestrator);
  _baselineRect;
  _constraints;
  _lastRect = null;
  _nodeOrGroup;
  _handleType;
  _nodeConnections = {
    source: [],
    target: []
  };
  _softParentConnections = [];
  initialize(nodeOrGroup, handleType) {
    this._nodeOrGroup = nodeOrGroup;
    this._handleType = handleType;
  }
  setNodeConnectionHandlers(handlers) {
    this._nodeConnections = handlers;
  }
  setSoftParentConnectionHandlers(handlers) {
    this._softParentConnections = handlers;
  }
  prepareDragSequence() {
    this._baselineRect = this._readBaselineRect();
    this._constraints = this._buildConstraints(this._baselineRect);
    this._lastRect = this._baselineRect;
  }
  onPointerMove(delta) {
    const nextRect = this._calcNextRect(delta);
    this._applyConstraints(nextRect);
    this._commitRect(nextRect);
    this._applyConnectionHandlers(this._nodeConnections);
    for (const parentConnections of this._softParentConnections) {
      this._applyConnectionHandlers(parentConnections);
    }
    this._lastRect = nextRect;
  }
  onPointerUp() {
    const rect = this._lastRect ?? this._fallbackRectFromModel();
    this._nodeOrGroup.sizeChange.emit(rect);
    this._reflowOrchestrator.handleResize(this._nodeOrGroup, this._baselineRect);
    requestAnimationFrame(() => this._nodeOrGroup.refresh());
  }
  // --------------------------
  // Build
  // --------------------------
  _readBaselineRect() {
    return this._mediator.execute(new GetNormalizedElementRectRequest(this._nodeOrGroup.hostElement));
  }
  _buildConstraints(baselineRect) {
    return this._mediator.execute(new CalculateResizeLimitsRequest(this._nodeOrGroup, baselineRect));
  }
  // --------------------------
  // Apply
  // --------------------------
  _calcNextRect(delta) {
    return this._mediator.execute(new CalculateChangedRectFromDifferenceRequest(this._baselineRect, delta, this._handleType, this._constraints.minimumSize));
  }
  _applyConstraints(rect) {
    this._mediator.execute(new ApplyChildResizeConstraintsRequest(rect, this._constraints.childrenBounds));
    this._mediator.execute(new ApplyParentResizeConstraintsRequest(rect, this._constraints.limits));
  }
  _commitRect(rect) {
    this._nodeOrGroup.updatePosition({
      x: rect.x,
      y: rect.y
    });
    this._nodeOrGroup.updateSize({
      width: rect.width,
      height: rect.height
    });
    this._mediator.execute(new SetFCacheNodeRectRequest(this._nodeOrGroup.fId(), rect));
    this._nodeOrGroup.redraw();
  }
  _fallbackRectFromModel() {
    return RectExtensions.initialize(this._nodeOrGroup._position.x, this._nodeOrGroup._position.y, this._nodeOrGroup._size?.width, this._nodeOrGroup._size?.height);
  }
  _applyConnectionHandlers(handlers) {
    if (!handlers.source.length && !handlers.target.length) {
      return;
    }
    const currentRectByConnectorId = /* @__PURE__ */ new Map();
    for (const source of handlers.source) {
      const currentRect = this._readConnectorRect(source.connector, currentRectByConnectorId);
      source.handler.setSourceRect(currentRect);
    }
    for (const target of handlers.target) {
      const currentRect = this._readConnectorRect(target.connector, currentRectByConnectorId);
      target.handler.setTargetRect(currentRect);
    }
  }
  _readConnectorRect(connector, cache) {
    const cacheKey = `${connector.kind}::${connector.fId()}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    const rect = this._mediator.execute(new GetNormalizedConnectorRectRequest(connector.hostElement, false));
    cache.set(cacheKey, rect);
    return rect;
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵResizeNodeHandler_BaseFactory;
    return function ResizeNodeHandler_Factory(__ngFactoryType__) {
      return (ɵResizeNodeHandler_BaseFactory || (ɵResizeNodeHandler_BaseFactory = ɵɵgetInheritedFactory(_ResizeNodeHandler)))(__ngFactoryType__ || _ResizeNodeHandler);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _ResizeNodeHandler,
    factory: _ResizeNodeHandler.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResizeNodeHandler, [{
    type: Injectable
  }], null, null);
})();
var ResizeNodeConnectionHandlerBase = class {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  _behaviour = inject(ConnectionBehaviourBuilder);
  _source;
  _target;
  _sourceRef;
  _targetRef;
  _sourceRect;
  _targetRect;
  connection;
  initialize(connection) {
    this.connection = connection;
    this._source = this._store.outputs.require(this.connection.fOutputId());
    this._target = this._store.inputs.require(this.connection.fInputId());
    this._sourceRef = this._readRectRef(this._source);
    this._targetRef = this._readRectRef(this._target);
    this._sourceRect = RoundedRect.fromRoundedRect(this._sourceRef.rect);
    this._targetRect = RoundedRect.fromRoundedRect(this._targetRef.rect);
  }
  setSourceRect(rect) {
    this._sourceRect = RoundedRect.fromRoundedRect(rect);
    this._mediator.execute(new SetFCacheConnectorRectRequest(this._source.fId(), this._source.kind, this._sourceRect));
  }
  setTargetRect(rect) {
    this._targetRect = RoundedRect.fromRoundedRect(rect);
    this._mediator.execute(new SetFCacheConnectorRectRequest(this._target.fId(), this._target.kind, this._targetRect));
  }
  redraw() {
    const line = this._buildLine();
    this.connection.setLine(line);
    this.connection.redraw();
  }
  _buildLine() {
    const sourceRect = RoundedRect.fromRoundedRect(this._sourceRect);
    const targetRect = RoundedRect.fromRoundedRect(this._targetRect);
    return this._behaviour.handle(new ConnectionBehaviourBuilderRequest(sourceRect, targetRect, this.connection, this._sourceRef.connector.fConnectableSide, this._targetRef.connector.fConnectableSide, this._resolveRotationContext(this._sourceRef.connector), this._resolveRotationContext(this._targetRef.connector)));
  }
  _readRectRef(connector) {
    return {
      connector,
      rect: this._mediator.execute(new GetNormalizedConnectorRectRequest(connector.hostElement, false))
    };
  }
  _resolveRotationContext(connector) {
    return this._mediator.execute(new ResolveConnectionEndpointRotationContextRequest(connector));
  }
};
var ResizeNodeConnectionBothSidesHandler = class _ResizeNodeConnectionBothSidesHandler extends ResizeNodeConnectionHandlerBase {
  _sourceUpdated = false;
  _targetUpdated = false;
  setSourceRect(rect) {
    super.setSourceRect(rect);
    this._sourceUpdated = true;
    this._redrawIfReady();
  }
  setTargetRect(rect) {
    super.setTargetRect(rect);
    this._targetUpdated = true;
    this._redrawIfReady();
  }
  _redrawIfReady() {
    if (!this._sourceUpdated || !this._targetUpdated) {
      return;
    }
    this._sourceUpdated = false;
    this._targetUpdated = false;
    super.redraw();
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵResizeNodeConnectionBothSidesHandler_BaseFactory;
    return function ResizeNodeConnectionBothSidesHandler_Factory(__ngFactoryType__) {
      return (ɵResizeNodeConnectionBothSidesHandler_BaseFactory || (ɵResizeNodeConnectionBothSidesHandler_BaseFactory = ɵɵgetInheritedFactory(_ResizeNodeConnectionBothSidesHandler)))(__ngFactoryType__ || _ResizeNodeConnectionBothSidesHandler);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _ResizeNodeConnectionBothSidesHandler,
    factory: _ResizeNodeConnectionBothSidesHandler.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResizeNodeConnectionBothSidesHandler, [{
    type: Injectable
  }], null, null);
})();
var ResizeNodeConnectionSourceHandler = class _ResizeNodeConnectionSourceHandler extends ResizeNodeConnectionHandlerBase {
  setSourceRect(rect) {
    super.setSourceRect(rect);
    super.redraw();
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵResizeNodeConnectionSourceHandler_BaseFactory;
    return function ResizeNodeConnectionSourceHandler_Factory(__ngFactoryType__) {
      return (ɵResizeNodeConnectionSourceHandler_BaseFactory || (ɵResizeNodeConnectionSourceHandler_BaseFactory = ɵɵgetInheritedFactory(_ResizeNodeConnectionSourceHandler)))(__ngFactoryType__ || _ResizeNodeConnectionSourceHandler);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _ResizeNodeConnectionSourceHandler,
    factory: _ResizeNodeConnectionSourceHandler.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResizeNodeConnectionSourceHandler, [{
    type: Injectable
  }], null, null);
})();
var ResizeNodeConnectionTargetHandler = class _ResizeNodeConnectionTargetHandler extends ResizeNodeConnectionHandlerBase {
  setTargetRect(rect) {
    super.setTargetRect(rect);
    super.redraw();
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵResizeNodeConnectionTargetHandler_BaseFactory;
    return function ResizeNodeConnectionTargetHandler_Factory(__ngFactoryType__) {
      return (ɵResizeNodeConnectionTargetHandler_BaseFactory || (ɵResizeNodeConnectionTargetHandler_BaseFactory = ɵɵgetInheritedFactory(_ResizeNodeConnectionTargetHandler)))(__ngFactoryType__ || _ResizeNodeConnectionTargetHandler);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _ResizeNodeConnectionTargetHandler,
    factory: _ResizeNodeConnectionTargetHandler.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResizeNodeConnectionTargetHandler, [{
    type: Injectable
  }], null, null);
})();
var ResizeNodePreparationRequest = class {
  event;
  fTrigger;
  static fToken = Symbol("ResizeNodePreparationRequest");
  constructor(event, fTrigger) {
    this.event = event;
    this.fTrigger = fTrigger;
  }
};
var AttachResizeConnectionDragHandlersToNodeRequest = class {
  handler;
  nodeOrGroup;
  static fToken = Symbol("AttachResizeConnectionDragHandlersToNodeRequest");
  constructor(handler, nodeOrGroup) {
    this.handler = handler;
    this.nodeOrGroup = nodeOrGroup;
  }
};
var AttachResizeConnectionDragHandlersToNode = class AttachResizeConnectionDragHandlersToNode2 {
  _store = inject(FComponentsStore);
  _mediator = inject(FMediator);
  _dragInjector = inject(DragHandlerInjector);
  handle({
    handler,
    nodeOrGroup
  }) {
    const softParents = this._readSoftParents(nodeOrGroup);
    const involvedNodes = [nodeOrGroup, ...softParents];
    const involvedSourceIds = this._collectSourceConnectorIds(involvedNodes);
    const involvedTargetIds = this._collectTargetConnectorIds(involvedNodes);
    const connectionHandlerPool = /* @__PURE__ */ new Map();
    handler.setNodeConnectionHandlers(this._buildConnectionHandlersForNode(nodeOrGroup, involvedSourceIds, involvedTargetIds, connectionHandlerPool));
    handler.setSoftParentConnectionHandlers(softParents.map((parent) => this._buildConnectionHandlersForNode(parent, involvedSourceIds, involvedTargetIds, connectionHandlerPool)));
  }
  _readSoftParents(nodeOrGroup) {
    const baselineRect = this._mediator.execute(new GetNormalizedElementRectRequest(nodeOrGroup.hostElement));
    const constraints = this._mediator.execute(new CalculateResizeLimitsRequest(nodeOrGroup, baselineRect));
    return constraints.limits.softLimits.map((x) => x.nodeOrGroup);
  }
  _collectSourceConnectorIds(nodes) {
    const nodeIds = new Set(nodes.map((x) => x.fId()));
    return new Set(this._store.outputs.getAll().filter((x) => nodeIds.has(x.fNodeId)).map((x) => x.fId()));
  }
  _collectTargetConnectorIds(nodes) {
    const nodeIds = new Set(nodes.map((x) => x.fId()));
    return new Set(this._store.inputs.getAll().filter((x) => nodeIds.has(x.fNodeId)).map((x) => x.fId()));
  }
  _buildConnectionHandlersForNode(nodeOrGroup, involvedSourceIds, involvedTargetIds, connectionHandlerPool) {
    const outputs = this._store.outputs.getAll().filter((x) => x.fNodeId === nodeOrGroup.fId());
    const inputs = this._store.inputs.getAll().filter((x) => x.fNodeId === nodeOrGroup.fId());
    if (!outputs.length && !inputs.length) {
      return {
        source: [],
        target: []
      };
    }
    const outputIds = new Set(outputs.map((x) => x.fId()));
    const inputIds = new Set(inputs.map((x) => x.fId()));
    const result = {
      source: [],
      target: []
    };
    for (const connection of this._store.connections.getAll()) {
      const isSource = outputIds.has(connection.fOutputId());
      const isTarget = inputIds.has(connection.fInputId());
      if (!isSource && !isTarget) {
        continue;
      }
      const connectionHandler = connectionHandlerPool.get(connection.fId()) ?? this._createConnectionHandler(connection, involvedSourceIds, involvedTargetIds);
      connectionHandlerPool.set(connection.fId(), connectionHandler);
      if (isSource) {
        const sourceConnector = this._store.outputs.require(connection.fOutputId());
        result.source.push({
          handler: connectionHandler,
          connector: sourceConnector
        });
      }
      if (isTarget) {
        const targetConnector = this._store.inputs.require(connection.fInputId());
        result.target.push({
          handler: connectionHandler,
          connector: targetConnector
        });
      }
    }
    return result;
  }
  _createConnectionHandler(connection, involvedSourceIds, involvedTargetIds) {
    const isSource = involvedSourceIds.has(connection.fOutputId());
    const isTarget = involvedTargetIds.has(connection.fInputId());
    const result = isSource && isTarget ? this._dragInjector.createInstance(ResizeNodeConnectionBothSidesHandler) : isSource ? this._dragInjector.createInstance(ResizeNodeConnectionSourceHandler) : this._dragInjector.createInstance(ResizeNodeConnectionTargetHandler);
    result.initialize(connection);
    return result;
  }
  static ɵfac = function AttachResizeConnectionDragHandlersToNode_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || AttachResizeConnectionDragHandlersToNode2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: AttachResizeConnectionDragHandlersToNode2,
    factory: AttachResizeConnectionDragHandlersToNode2.ɵfac
  });
};
AttachResizeConnectionDragHandlersToNode = __decorate([FExecutionRegister(AttachResizeConnectionDragHandlersToNodeRequest)], AttachResizeConnectionDragHandlersToNode);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AttachResizeConnectionDragHandlersToNode, [{
    type: Injectable
  }], null, null);
})();
var ResizeNodePreparation = class ResizeNodePreparation2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  _dragSession = inject(FDraggableDataContext);
  _dragInjector = inject(DragHandlerInjector);
  get _transform() {
    return this._store.transform;
  }
  handle({
    event,
    fTrigger
  }) {
    if (!this._dragSession.isEmpty()) {
      return;
    }
    if (!this._isResizeHandle(event.targetElement)) {
      return;
    }
    if (!isValidEventTrigger(event.originalEvent, fTrigger)) {
      return;
    }
    const nodeOrGroup = this._findResizableNode(event.targetElement);
    if (!nodeOrGroup) {
      return;
    }
    this._selectBeforeResize(nodeOrGroup);
    const scale = this._transform.scale ?? 1;
    this._dragSession.onPointerDownScale = scale;
    this._dragSession.onPointerDownPosition = Point.fromPoint(event.getPosition()).elementTransform(this._store.flowHost).div(scale);
    const handler = this._dragInjector.createInstance(ResizeNodeHandler);
    handler.initialize(nodeOrGroup, this._readResizeHandleType(event.targetElement));
    this._mediator.execute(new AttachResizeConnectionDragHandlersToNodeRequest(handler, nodeOrGroup));
    this._dragSession.draggableItems = [handler];
  }
  _isResizeHandle(target) {
    return isClosestElementHasClass(target, ".f-resize-handle");
  }
  _findResizableNode(target) {
    const nodeOrGroup = this._store.nodes.getAll().find((x) => x.isContains(target));
    if (!nodeOrGroup) {
      return void 0;
    }
    return nodeOrGroup.fDraggingDisabled() ? void 0 : nodeOrGroup;
  }
  _selectBeforeResize(nodeOrGroup) {
    queueMicrotask(() => {
      this._mediator.execute(new SelectAndUpdateNodeLayerRequest(nodeOrGroup));
    });
  }
  _readResizeHandleType(target) {
    const key = getDataAttrValueFromClosestElementWithClass(target, "fResizeHandleType", ".f-resize-handle");
    return EFResizeHandleType[key];
  }
  static ɵfac = function ResizeNodePreparation_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ResizeNodePreparation2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ResizeNodePreparation2,
    factory: ResizeNodePreparation2.ɵfac
  });
};
ResizeNodePreparation = __decorate([FExecutionRegister(ResizeNodePreparationRequest)], ResizeNodePreparation);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResizeNodePreparation, [{
    type: Injectable
  }], null, null);
})();
var NODE_RESIZE_PROVIDERS = [ApplyChildResizeConstraints, ApplyParentResizeConstraints, CalculateChangedRectFromDifference, CalculateDirectChildrenUnionRect, CalculateResizeLimits, AttachResizeConnectionDragHandlersToNode, ResizeNodeFinalize, ResizeNodePreparation];
var RotateNodeFinalizeRequest = class {
  event;
  static fToken = Symbol("RotateNodeFinalizeRequest");
  constructor(event) {
    this.event = event;
  }
};
var ROTATE_NODE_HANDLER_TYPE = "node-rotate";
var ROTATE_NODE_HANDLER_KIND = "rotate-node";
function isRotateNodeHandler(value) {
  return value.getEvent().kind === ROTATE_NODE_HANDLER_KIND || value.getEvent().fEventType === ROTATE_NODE_HANDLER_TYPE;
}
var RotateNodeFinalize = class RotateNodeFinalize2 {
  _dragSession = inject(FDraggableDataContext);
  handle(_request) {
    if (!this._isValid()) {
      return;
    }
    this._dragSession.draggableItems.forEach((x) => {
      x.onPointerUp?.();
    });
  }
  _isValid() {
    return this._dragSession.draggableItems.some((x) => isRotateNodeHandler(x));
  }
  static ɵfac = function RotateNodeFinalize_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RotateNodeFinalize2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RotateNodeFinalize2,
    factory: RotateNodeFinalize2.ɵfac
  });
};
RotateNodeFinalize = __decorate([FExecutionRegister(RotateNodeFinalizeRequest)], RotateNodeFinalize);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RotateNodeFinalize, [{
    type: Injectable
  }], null, null);
})();
var RotateNodePreparationRequest = class {
  event;
  fTrigger;
  static fToken = Symbol("RotateNodePreparationRequest");
  constructor(event, fTrigger) {
    this.event = event;
    this.fTrigger = fTrigger;
  }
};
var FRotateNodeStartEventData = class {
  fNodeId;
  constructor(fNodeId) {
    this.fNodeId = fNodeId;
  }
};
function calculateDifferenceAfterRotation(position, rotation, pivot) {
  const {
    x: newX,
    y: newY
  } = calculatePositionAfterRotation(position, rotation, pivot);
  const dx = newX - position.x;
  const dy = newY - position.y;
  return {
    x: dx,
    y: dy
  };
}
function calculatePositionAfterRotation(position, rotation, pivot) {
  const translatedX = position.x - pivot.x;
  const translatedY = position.y - pivot.y;
  const theta = rotation * Math.PI / 180;
  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sin(theta);
  const rotatedX = translatedX * cosTheta - translatedY * sinTheta;
  const rotatedY = translatedX * sinTheta + translatedY * cosTheta;
  const newX = rotatedX + pivot.x;
  const newY = rotatedY + pivot.y;
  return {
    x: newX,
    y: newY
  };
}
var RotateNodeHandler = class _RotateNodeHandler extends DragHandlerBase {
  type = ROTATE_NODE_HANDLER_TYPE;
  kind = ROTATE_NODE_HANDLER_KIND;
  data() {
    return new FRotateNodeStartEventData(this._nodeOrGroup.fId());
  }
  _store = inject(FComponentsStore);
  _mediator = inject(FMediator);
  _dragSession = inject(FDraggableDataContext);
  _nodeOrGroup;
  _sourceConnections;
  _targetConnections;
  _startRotation = 0;
  _nodeRect;
  _nodeCenter;
  _pointerDownInFlow;
  /**
   * Difference between pointer angle and node rotation at pointer-down.
   * This lets us keep rotation “locked” to the initial grab angle.
   */
  _rotationOffsetDeg = 0;
  get _transform() {
    return this._store.transform;
  }
  initialize(nodeOrGroup, sourceConnections, targetConnections) {
    this._nodeOrGroup = nodeOrGroup;
    this._sourceConnections = sourceConnections;
    this._targetConnections = targetConnections;
    this._startRotation = this._nodeOrGroup._rotate;
  }
  prepareDragSequence() {
    this._nodeRect = this._readNodeRect();
    this._nodeCenter = this._nodeRect.gravityCenter;
    this._pointerDownInFlow = this._calculatePointerDownInFlow();
    const pointerAngleDeg = this._angleDeg(this._pointerDownInFlow);
    this._rotationOffsetDeg = pointerAngleDeg - this._startRotation;
  }
  onPointerMove(delta) {
    const pointerPos = PointExtensions.sum(this._pointerDownInFlow, delta);
    const pointerAngleDeg = this._angleDeg(pointerPos);
    const nextRotation = pointerAngleDeg - this._rotationOffsetDeg;
    this._applyRotation(nextRotation);
    const rotationDelta = nextRotation - this._startRotation;
    for (const h of this._sourceConnections) {
      h.connection.setSourceDelta(this._deltaAfterRotation(h.connector, rotationDelta));
    }
    for (const h of this._targetConnections) {
      h.connection.setTargetDelta(this._deltaAfterRotation(h.connector, rotationDelta));
    }
  }
  onPointerUp() {
    this._nodeOrGroup.rotate.set(this._nodeOrGroup._rotate);
    this._nodeOrGroup.refresh();
  }
  _readNodeRect() {
    return this._mediator.execute(new GetNormalizedElementRectRequest(this._nodeOrGroup.hostElement));
  }
  _calculatePointerDownInFlow() {
    return PointExtensions.sub(this._dragSession.onPointerDownPosition, PointExtensions.sum(this._transform.position, this._transform.scaledPosition));
  }
  _angleDeg(p) {
    return Math.atan2(p.y - this._nodeCenter.y, p.x - this._nodeCenter.x) * (180 / Math.PI);
  }
  _applyRotation(rotationDeg) {
    this._nodeOrGroup.updateRotate(rotationDeg);
    this._nodeOrGroup.redraw();
  }
  _deltaAfterRotation(connector, rotationDeltaDeg) {
    return calculateDifferenceAfterRotation(connector, rotationDeltaDeg, this._nodeCenter);
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵRotateNodeHandler_BaseFactory;
    return function RotateNodeHandler_Factory(__ngFactoryType__) {
      return (ɵRotateNodeHandler_BaseFactory || (ɵRotateNodeHandler_BaseFactory = ɵɵgetInheritedFactory(_RotateNodeHandler)))(__ngFactoryType__ || _RotateNodeHandler);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _RotateNodeHandler,
    factory: _RotateNodeHandler.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RotateNodeHandler, [{
    type: Injectable
  }], null, null);
})();
var RotateNodePreparation = class RotateNodePreparation2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  _dragContext = inject(FDraggableDataContext);
  _dragInjector = inject(DragHandlerInjector);
  get _transform() {
    return this._store.transform;
  }
  handle(request) {
    if (!this._isPreparationAllowed(request)) {
      return;
    }
    const nodeOrGroup = this._findRotatableNode(request.event.targetElement);
    if (!nodeOrGroup) {
      return;
    }
    this._selectBeforeRotate(nodeOrGroup);
    const scale = this._transform.scale;
    this._dragContext.onPointerDownScale = scale;
    this._dragContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition()).elementTransform(this._store.flowHost).div(scale);
    const handler = this._dragInjector.createInstance(RotateNodeHandler);
    handler.initialize(nodeOrGroup, this._buildOutputConnectionHandlers(nodeOrGroup), this._buildInputConnectionHandlers(nodeOrGroup));
    this._dragContext.draggableItems = [handler];
  }
  _isPreparationAllowed({
    event,
    fTrigger
  }) {
    return this._dragContext.isEmpty() && isRotateHandle(event.targetElement) && isValidEventTrigger(event.originalEvent, fTrigger);
  }
  _findRotatableNode(target) {
    for (const node of this._store.nodes.getAll()) {
      if (node.fDraggingDisabled()) {
        continue;
      }
      if (node.isContains(target)) {
        return node;
      }
    }
    return void 0;
  }
  _selectBeforeRotate(node) {
    queueMicrotask(() => {
      this._mediator.execute(new SelectAndUpdateNodeLayerRequest(node));
    });
  }
  _buildInputConnectionHandlers(nodeOrGroup) {
    return this._mediator.execute(new CalculateInputConnectionsRequest(nodeOrGroup)).map((x) => {
      const connector = this._store.inputs.require(x.fInputId());
      const connectorRef = this._mediator.execute(new GetConnectorRectReferenceRequest(connector));
      const handler = this._dragInjector.get(DragNodeConnectionTargetHandler);
      handler.initialize(x);
      return {
        connection: handler,
        connector: connectorRef.rect.gravityCenter
      };
    });
  }
  _buildOutputConnectionHandlers(nodeOrGroup) {
    return this._mediator.execute(new CalculateOutputConnectionsRequest(nodeOrGroup)).map((x) => {
      const connector = this._store.outputs.require(x.fOutputId());
      const connectorRef = this._mediator.execute(new GetConnectorRectReferenceRequest(connector));
      const handler = this._dragInjector.get(DragNodeConnectionSourceHandler);
      handler.initialize(x);
      return {
        connection: handler,
        connector: connectorRef.rect.gravityCenter
      };
    });
  }
  static ɵfac = function RotateNodePreparation_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RotateNodePreparation2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RotateNodePreparation2,
    factory: RotateNodePreparation2.ɵfac
  });
};
RotateNodePreparation = __decorate([FExecutionRegister(RotateNodePreparationRequest)], RotateNodePreparation);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RotateNodePreparation, [{
    type: Injectable
  }], null, null);
})();
var NODE_ROTATE_PROVIDERS = [RotateNodeFinalize, RotateNodePreparation];
var CalculateFlowPointFromMinimapPointRequest = class {
  flowRect;
  canvasPosition;
  eventPoint;
  minimap;
  static fToken = Symbol("CalculateFlowPointFromMinimapPointRequest");
  constructor(flowRect, canvasPosition, eventPoint, minimap) {
    this.flowRect = flowRect;
    this.canvasPosition = canvasPosition;
    this.eventPoint = eventPoint;
    this.minimap = minimap;
  }
};
var CalculateFlowPointFromMinimapPoint = class CalculateFlowPointFromMinimapPoint2 {
  _store = inject(FComponentsStore);
  get _canvasScale() {
    return this._store.transform.scale || 1;
  }
  handle(payload) {
    return PointExtensions.sub(payload.canvasPosition, PointExtensions.sub(this._getPositionInViewBox(payload.eventPoint, payload.minimap), this._getNormalizedFlowCenter(payload.flowRect)));
  }
  _getNormalizedFlowCenter(flowRect) {
    return Point.fromPoint(flowRect.gravityCenter).sub(flowRect);
  }
  _getPositionInViewBox(eventPoint, minimap) {
    const eventPointInFlow = this.normalizeEventPoint(eventPoint, minimap);
    return PointExtensions.sum(eventPointInFlow, RectExtensions.mult(minimap.viewBox, this._canvasScale));
  }
  normalizeEventPoint(point, minimap) {
    return this._getEventPointInMinimap(point, minimap).mult(minimap.scale).mult(this._canvasScale);
  }
  _getEventPointInMinimap(eventPoint, minimap) {
    return Point.fromPoint(eventPoint).elementTransform(minimap.element);
  }
  static ɵfac = function CalculateFlowPointFromMinimapPoint_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CalculateFlowPointFromMinimapPoint2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CalculateFlowPointFromMinimapPoint2,
    factory: CalculateFlowPointFromMinimapPoint2.ɵfac
  });
};
CalculateFlowPointFromMinimapPoint = __decorate([FExecutionRegister(CalculateFlowPointFromMinimapPointRequest)], CalculateFlowPointFromMinimapPoint);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalculateFlowPointFromMinimapPoint, [{
    type: Injectable
  }], null, null);
})();
var DragMinimapFinalizeRequest = class {
  event;
  static fToken = Symbol("DragMinimapFinalizeRequest");
  constructor(event) {
    this.event = event;
  }
};
var DragMinimapFinalize = class DragMinimapFinalize2 {
  _dragSession = inject(FDraggableDataContext);
  handle(_request) {
    if (!this._isValid()) {
      return;
    }
    this._dragSession.draggableItems.forEach((x) => {
      x.onPointerUp?.();
    });
  }
  _isValid() {
    return this._dragSession.draggableItems.some(isDragMinimapHandler);
  }
  static ɵfac = function DragMinimapFinalize_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || DragMinimapFinalize2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: DragMinimapFinalize2,
    factory: DragMinimapFinalize2.ɵfac
  });
};
DragMinimapFinalize = __decorate([FExecutionRegister(DragMinimapFinalizeRequest)], DragMinimapFinalize);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DragMinimapFinalize, [{
    type: Injectable
  }], null, null);
})();
var DRAG_MINIMAP_HANDLER_TYPE = "minimap";
var DRAG_MINIMAP_HANDLER_KIND = "minimap";
function isDragMinimapHandler(value) {
  return value.getEvent().kind === DRAG_MINIMAP_HANDLER_KIND || value.getEvent().fEventType === DRAG_MINIMAP_HANDLER_TYPE;
}
var DragMinimapHandler = class _DragMinimapHandler extends DragHandlerBase {
  type = DRAG_MINIMAP_HANDLER_TYPE;
  kind = DRAG_MINIMAP_HANDLER_KIND;
  _store = inject(FComponentsStore);
  _mediator = inject(FMediator);
  _lastDelta = null;
  _flowRect;
  _startCanvasPosition;
  _eventPoint;
  _minimap;
  initialize(flowRect, startCanvasPosition, eventPoint, minimap) {
    this._flowRect = flowRect;
    this._startCanvasPosition = startCanvasPosition;
    this._eventPoint = eventPoint;
    this._minimap = minimap;
  }
  prepareDragSequence() {
    this._store.fCanvas?.hostElement.classList.add("f-scaled-animate");
  }
  onPointerMove(delta) {
    if (this._lastDelta && this._isSamePoint(delta, this._lastDelta)) {
      return;
    }
    this._lastDelta = delta;
    this._store.fCanvas?._setPosition(this._getNewPosition(Point.fromPoint(this._eventPoint).add(delta)));
    this._store.fCanvas?.redraw();
  }
  _isSamePoint(point1, point2) {
    return point1.x === point2.x && point1.y === point2.y;
  }
  _getNewPosition(eventPoint) {
    return this._mediator.execute(new CalculateFlowPointFromMinimapPointRequest(this._flowRect, this._startCanvasPosition, eventPoint, this._minimap));
  }
  onPointerUp() {
    this._store.fCanvas?.hostElement.classList.remove("f-scaled-animate");
    this._store.fCanvas?.emitCanvasChangeEvent();
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵDragMinimapHandler_BaseFactory;
    return function DragMinimapHandler_Factory(__ngFactoryType__) {
      return (ɵDragMinimapHandler_BaseFactory || (ɵDragMinimapHandler_BaseFactory = ɵɵgetInheritedFactory(_DragMinimapHandler)))(__ngFactoryType__ || _DragMinimapHandler);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _DragMinimapHandler,
    factory: _DragMinimapHandler.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DragMinimapHandler, [{
    type: Injectable
  }], null, null);
})();
var DragMinimapPreparationRequest = class {
  event;
  static fToken = Symbol("DragMinimapPreparationRequest");
  constructor(event) {
    this.event = event;
  }
};
var DragMinimapPreparation = class DragMinimapPreparation2 {
  _store = inject(FComponentsStore);
  _mediator = inject(FMediator);
  _dragSession = inject(FDraggableDataContext);
  _dragInjector = inject(DragHandlerInjector);
  get _canvas() {
    return this._store.fCanvas;
  }
  get _flowHost() {
    return this._store.flowHost;
  }
  handle({
    event
  }) {
    if (!this._isValid(event)) {
      return;
    }
    const state = this._store.instances.require(INSTANCES.MINIMAP).state;
    const eventPoint = event.getPosition();
    const startCanvasPosition = Point.fromPoint(this._store.transform.position);
    const flowRect = RectExtensions.fromElement(this._flowHost);
    this._canvas._setPosition(this._calculateCanvasPosition(flowRect, eventPoint, state));
    this._canvas.redraw();
    this._canvas.emitCanvasChangeEvent();
    this._dragSession.onPointerDownScale = 1;
    this._dragSession.onPointerDownPosition = Point.fromPoint(eventPoint).elementTransform(this._flowHost);
    const handler = this._dragInjector.createInstance(DragMinimapHandler);
    handler.initialize(flowRect, startCanvasPosition, eventPoint, state);
    this._dragSession.draggableItems = [handler];
  }
  _isValid(event) {
    if (!this._dragSession.isEmpty()) {
      return false;
    }
    if (!this._flowHost.contains(event.targetElement)) {
      return false;
    }
    if (!event.targetElement.closest(".f-minimap")) {
      return false;
    }
    if (!this._store.instances.get(INSTANCES.MINIMAP)) {
      return false;
    }
    return true;
  }
  _calculateCanvasPosition(flowRect, eventPoint, minimap) {
    return this._mediator.execute(new CalculateFlowPointFromMinimapPointRequest(flowRect, Point.fromPoint(this._canvas.transform.position), eventPoint, minimap));
  }
  static ɵfac = function DragMinimapPreparation_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || DragMinimapPreparation2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: DragMinimapPreparation2,
    factory: DragMinimapPreparation2.ɵfac
  });
};
DragMinimapPreparation = __decorate([FExecutionRegister(DragMinimapPreparationRequest)], DragMinimapPreparation);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DragMinimapPreparation, [{
    type: Injectable
  }], null, null);
})();
var DRAG_MINIMAP_PROVIDERS = [CalculateFlowPointFromMinimapPoint, DragMinimapFinalize, DragMinimapPreparation];
function isDestroyable(value) {
  return !!value && typeof value.destroy === "function";
}
var DragHandlerInjector = class _DragHandlerInjector {
  _injector = inject(Injector);
  _dragInjector = null;
  _created = [];
  create() {
    this._dragInjector = Injector.create({
      providers: [{
        provide: DragCanvasHandler,
        useClass: DragCanvasHandler
      }, {
        provide: DragConnectionWaypointHandler,
        useClass: DragConnectionWaypointHandler
      }, {
        provide: CreateConnectionHandler,
        useClass: CreateConnectionHandler
      }, {
        provide: ReassignConnectionHandler,
        useClass: ReassignConnectionHandler
      }, {
        provide: DropToGroupHandler,
        useClass: DropToGroupHandler
      }, {
        provide: DragNodeConnectionSourceHandler,
        useClass: DragNodeConnectionSourceHandler
      }, {
        provide: DragNodeConnectionTargetHandler,
        useClass: DragNodeConnectionTargetHandler
      }, {
        provide: DragNodeConnectionBothSidesHandler,
        useClass: DragNodeConnectionBothSidesHandler
      }, {
        provide: DragNodeHandler,
        useClass: DragNodeHandler
      }, {
        provide: PinchToZoomHandler,
        useClass: PinchToZoomHandler
      }, {
        provide: SelectionAreaHandler,
        useClass: SelectionAreaHandler
      }, {
        provide: ResizeNodeHandler,
        useClass: ResizeNodeHandler
      }, {
        provide: RotateNodeHandler,
        useClass: RotateNodeHandler
      }, {
        provide: DragMinimapHandler,
        useClass: DragMinimapHandler
      }],
      parent: this._injector
    });
    this._created = [];
  }
  get(token) {
    if (!this._dragInjector) {
      throw new Error("DragHandlerInjector has not been created. Call create() before using get().");
    }
    return this._dragInjector.get(token);
  }
  createInstance(ctor) {
    if (!this._dragInjector) {
      throw new Error("DragHandlerInjector is not created");
    }
    const instance = runInInjectionContext(this._dragInjector, () => new ctor());
    this._created.push(instance);
    return instance;
  }
  destroy() {
    for (const x of this._created) {
      if (isDestroyable(x)) {
        x.destroy();
      }
    }
    this._created = [];
    this._dragInjector?.destroy?.();
    this._dragInjector = null;
  }
  static ɵfac = function DragHandlerInjector_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DragHandlerInjector)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _DragHandlerInjector,
    factory: _DragHandlerInjector.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DragHandlerInjector, [{
    type: Injectable
  }], null, null);
})();
var FDragHandlerResult = class _FDragHandlerResult {
  _data;
  setData(data) {
    this._data = __spreadValues(__spreadValues({}, this._data), data);
  }
  getData() {
    return this._data;
  }
  clear() {
    this._data = void 0;
  }
  static ɵfac = function FDragHandlerResult_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FDragHandlerResult)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _FDragHandlerResult,
    factory: _FDragHandlerResult.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FDragHandlerResult, [{
    type: Injectable
  }], null, null);
})();
var F_CANVAS_DRAGGING_CLASS = "f-canvas-dragging";
var LEGACY_CANVAS_DRAGGING_CLASS = "canvas-dragging";
var DragCanvasHandler = class _DragCanvasHandler extends DragHandlerBase {
  type = "canvas-move";
  kind = "drag-canvas";
  _store = inject(FComponentsStore);
  _onPointerDownPosition = PointExtensions.initialize();
  constructor() {
    super();
    this._store.fCanvas?.hostElement.classList.add(F_CANVAS_DRAGGING_CLASS, LEGACY_CANVAS_DRAGGING_CLASS);
  }
  prepareDragSequence() {
    this._onPointerDownPosition = this._store.transform.position;
  }
  onPointerMove(difference) {
    this._store.fCanvas?._setPosition(Point.fromPoint(this._onPointerDownPosition).add(difference));
    this._store.fCanvas?.redraw();
  }
  onPointerUp() {
    this._store.fCanvas?.emitCanvasChangeEvent();
    this._store.fCanvas?.hostElement.classList.remove(F_CANVAS_DRAGGING_CLASS, LEGACY_CANVAS_DRAGGING_CLASS);
  }
  static ɵfac = function DragCanvasHandler_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DragCanvasHandler)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _DragCanvasHandler,
    factory: _DragCanvasHandler.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DragCanvasHandler, [{
    type: Injectable
  }], () => [], null);
})();
var DragCanvasFinalize = class DragCanvasFinalize2 {
  _dragContext = inject(FDraggableDataContext);
  handle(_request) {
    if (!this._isValid()) {
      return;
    }
    this._dragContext.draggableItems.forEach((x) => x.onPointerUp?.());
  }
  _isValid() {
    return this._dragContext.draggableItems.some((x) => x instanceof DragCanvasHandler);
  }
  static ɵfac = function DragCanvasFinalize_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || DragCanvasFinalize2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: DragCanvasFinalize2,
    factory: DragCanvasFinalize2.ɵfac
  });
};
DragCanvasFinalize = __decorate([FExecutionRegister(DragCanvasFinalizeRequest)], DragCanvasFinalize);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DragCanvasFinalize, [{
    type: Injectable
  }], null, null);
})();
var DragCanvasPreparationRequest = class {
  event;
  fTrigger;
  static fToken = Symbol("DragCanvasPreparationRequest");
  constructor(event, fTrigger) {
    this.event = event;
    this.fTrigger = fTrigger;
  }
};
var DragCanvasPreparation = class DragCanvasPreparation2 {
  _store = inject(FComponentsStore);
  _dragContext = inject(FDraggableDataContext);
  _dragInjector = inject(DragHandlerInjector);
  handle({
    event,
    fTrigger
  }) {
    if (!this._isValid(event) || !this._isValidTrigger(event, fTrigger)) {
      return;
    }
    this._dragContext.onPointerDownScale = 1;
    this._dragContext.onPointerDownPosition = Point.fromPoint(event.getPosition()).elementTransform(this._store.flowHost);
    this._dragContext.draggableItems = [this._dragInjector.get(DragCanvasHandler)];
  }
  _isValid(event) {
    return this._dragContext.isEmpty() && (this._isBackgroundElement(event.targetElement) || this._isDragOnHost(event.targetElement));
  }
  _isBackgroundElement(targetElement) {
    return this._store.instances.get(INSTANCES.BACKGROUND)?.hostElement.contains(targetElement);
  }
  _isDragOnHost(targetElement) {
    return this._store.flowHost.contains(targetElement) && !this._getNode(targetElement);
  }
  _getNode(targetElement) {
    let result = this._store.nodes.getAll().find((x) => x.isContains(targetElement));
    if (result && result.fDraggingDisabled()) {
      result = void 0;
    }
    return result;
  }
  _isValidTrigger(event, fTrigger) {
    return isValidEventTrigger(event.originalEvent, fTrigger);
  }
  static ɵfac = function DragCanvasPreparation_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || DragCanvasPreparation2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: DragCanvasPreparation2,
    factory: DragCanvasPreparation2.ɵfac
  });
};
DragCanvasPreparation = __decorate([FExecutionRegister(DragCanvasPreparationRequest)], DragCanvasPreparation);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DragCanvasPreparation, [{
    type: Injectable
  }], null, null);
})();
var DRAG_CANVAS_PROVIDERS = [DragCanvasFinalize, DragCanvasPreparation];
var SelectByPointerRequest = class {
  event;
  trigger;
  static fToken = Symbol("SelectByPointerRequest");
  constructor(event, trigger) {
    this.event = event;
    this.trigger = trigger;
  }
};
var SelectByPointer = class SelectByPointer2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  _dragSession = inject(FDraggableDataContext);
  handle({
    event,
    trigger
  }) {
    if (!this._isSelectionAllowed(event)) {
      return;
    }
    const item = this._resolveSelectable(event.targetElement);
    this._deferRaiseLayerFor(item);
    const isMultiSelect = isValidEventTrigger(event.originalEvent, trigger);
    isMultiSelect ? this._applyToggleSelect(item) : this._applySingleSelect(item);
  }
  _isSelectionAllowed(event) {
    return this._store.flowHost.contains(event.targetElement) && this._dragSession.isEmpty();
  }
  _resolveSelectable(target) {
    return this._findNodeOrGroupAt(target) ?? this._findConnectionAt(target);
  }
  _findNodeOrGroupAt(target) {
    return this._store.nodes.getAll().find((x) => x.isContains(target));
  }
  _findConnectionAt(target) {
    return this._store.connections.getAll().find((x) => x.isContains(target));
  }
  _deferRaiseLayerFor(item) {
    if (!item) {
      return;
    }
    queueMicrotask(() => {
      this._mediator.execute(new UpdateItemAndChildrenLayersRequest(item, item.hostElement.parentElement));
    });
  }
  _applySingleSelect(item) {
    if (!item || item.fSelectionDisabled()) {
      this._clearSelection();
      return;
    }
    if (!item.isSelected()) {
      this._clearSelection();
      this._select(item);
    }
  }
  _applyToggleSelect(item) {
    if (!item || item.fSelectionDisabled()) {
      return;
    }
    item.isSelected() ? this._deselect(item) : this._select(item);
  }
  _clearSelection() {
    if (!this._dragSession.selectedItems.length) {
      return;
    }
    for (const item of this._dragSession.selectedItems) {
      item.unmarkAsSelected();
    }
    this._dragSession.markSelectionAsChanged();
    this._dragSession.selectedItems = [];
  }
  _select(item) {
    this._dragSession.selectedItems.push(item);
    item.markAsSelected();
    this._dragSession.markSelectionAsChanged();
  }
  _deselect(item) {
    const idx = this._dragSession.selectedItems.indexOf(item);
    if (idx >= 0) {
      this._dragSession.selectedItems.splice(idx, 1);
    }
    item.unmarkAsSelected();
    this._dragSession.markSelectionAsChanged();
  }
  static ɵfac = function SelectByPointer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SelectByPointer2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: SelectByPointer2,
    factory: SelectByPointer2.ɵfac
  });
};
SelectByPointer = __decorate([FExecutionRegister(SelectByPointerRequest)], SelectByPointer);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SelectByPointer, [{
    type: Injectable
  }], null, null);
})();
var DRAG_SELECT_BY_POINTER_PROVIDERS = [SelectByPointer];
var FDragBlockerDirective = class _FDragBlockerDirective {
  static ɵfac = function FDragBlockerDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FDragBlockerDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FDragBlockerDirective,
    selectors: [["", "fDragBlocker", ""]],
    hostAttrs: [1, "f-drag-blocker"],
    standalone: false
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FDragBlockerDirective, [{
    type: Directive,
    args: [{
      standalone: false,
      selector: "[fDragBlocker]",
      host: {
        class: `f-drag-blocker`
      }
    }]
  }], null, null);
})();
var FDraggableBase = class extends DragAndDropBase {
  hostElement = inject(ElementRef).nativeElement;
};
function isDragBlocker(element) {
  return isClosestElementHasClass(element, ".f-drag-blocker");
}
var FDraggableDirective = class _FDraggableDirective extends FDraggableBase {
  _result = inject(FDragHandlerResult);
  _mediator = inject(FMediator);
  _platform = inject(PlatformService);
  disabled = false;
  fMultiSelectTrigger = (event) => {
    return this._platform.getOS() === EOperationSystem.MAC_OS ? event.metaKey : event.ctrlKey;
  };
  fReassignConnectionTrigger = defaultEventTrigger;
  fCreateConnectionTrigger = defaultEventTrigger;
  fConnectionWaypointsTrigger = input(defaultEventTrigger, ...ngDevMode ? [{
    debugName: "fConnectionWaypointsTrigger"
  }] : []);
  fMoveControlPointTrigger = defaultEventTrigger;
  fNodeResizeTrigger = defaultEventTrigger;
  fNodeRotateTrigger = defaultEventTrigger;
  fNodeMoveTrigger = defaultEventTrigger;
  fCanvasMoveTrigger = defaultEventTrigger;
  fExternalItemTrigger = defaultEventTrigger;
  fSelectionChange = new EventEmitter();
  /** @deprecated Use `fNodeConnectionsIntersection` */
  fNodeIntersectedWithConnections = new EventEmitter();
  fNodeConnectionsIntersection = output();
  fEmitOnNodeIntersect = false;
  fCreateNode = new EventEmitter();
  fMoveNodes = new EventEmitter();
  fReassignConnection = new EventEmitter();
  fCreateConnection = new EventEmitter();
  fConnectionWaypointsChanged = output();
  fDropToGroup = new EventEmitter();
  /**
   * Defines the vertical cell size for the grid.
   * This value is used to snap nodes to a vertical grid while dragging.
   * The default value is `1`, which means that nodes will snap to every pixel vertically.
   */
  vCellSize = input(1, ...ngDevMode ? [{
    debugName: "vCellSize",
    transform: (value) => numberAttribute(value, 1)
  }] : [{
    transform: (value) => numberAttribute(value, 1)
  }]);
  /**
   * Defines the horizontal cell size for the grid.
   * This value is used to snap nodes to a horizontal grid while dragging.
   * The default value is `1`, which means that nodes will snap to every pixel horizontally.
   */
  hCellSize = input(1, ...ngDevMode ? [{
    debugName: "hCellSize",
    transform: (value) => numberAttribute(value, 1)
  }] : [{
    transform: (value) => numberAttribute(value, 1)
  }]);
  /**
   * Defines whether the cell size should be applied while dragging.
   * If set to `true`, the dragged nodes will snap to the grid defined by `vCellSize` and `hCellSize`.
   * If set to `false`, the nodes will move freely without snapping to the grid.
   */
  fCellSizeWhileDragging = input(false, ...ngDevMode ? [{
    debugName: "fCellSizeWhileDragging",
    transform: (value) => booleanAttribute(value)
  }] : [{
    transform: (value) => booleanAttribute(value)
  }]);
  fDragStarted = new EventEmitter();
  fDragEnded = new EventEmitter();
  _dragHandlerInjector = inject(DragHandlerInjector);
  ngOnInit() {
    this._mediator.execute(new AddDndToStoreRequest(this));
  }
  ngAfterViewInit() {
    super.subscribe();
  }
  onPointerDown(event) {
    if (isDragBlocker(event.targetElement)) {
      return false;
    }
    this._dragHandlerInjector.create();
    this._result.clear();
    this._mediator.execute(new InitializeDragSequenceRequest());
    this._mediator.execute(new SelectionAreaPreparationRequest(event));
    this._mediator.execute(new DragMinimapPreparationRequest(event));
    this._mediator.execute(new PinchToZoomPreparationRequest(event));
    this._mediator.execute(new SelectByPointerRequest(event, this.fMultiSelectTrigger));
    this._mediator.execute(new ReassignConnectionPreparationRequest(event, this.fReassignConnectionTrigger));
    this._mediator.execute(new CreateConnectionPreparationRequest(event, this.fCreateConnectionTrigger));
    this._mediator.execute(new DragConnectionWaypointPreparationRequest(event, this.fConnectionWaypointsTrigger()));
    const isMouseLeftOrTouch = event.isMouseLeftButton();
    if (!isMouseLeftOrTouch) {
      this.finalizeDragSequence();
    }
    return isMouseLeftOrTouch;
  }
  prepareDragSequence(event) {
    this._mediator.execute(new ResizeNodePreparationRequest(event, this.fNodeResizeTrigger));
    this._mediator.execute(new RotateNodePreparationRequest(event, this.fNodeRotateTrigger));
    this._mediator.execute(new DragNodePreparationRequest(event, this.fNodeMoveTrigger));
    this._mediator.execute(new DragExternalItemPreparationRequest(event, this.fExternalItemTrigger));
    this._mediator.execute(new DropToGroupPreparationRequest(event));
    this._mediator.execute(new DragCanvasPreparationRequest(event, this.fCanvasMoveTrigger));
    this._mediator.execute(new PrepareDragSequenceRequest());
  }
  onSelect(event) {
    this._mediator.execute(new PreventDefaultIsExternalItemRequest(event));
  }
  onPointerMove(event) {
    this._mediator.execute(new OnPointerMoveRequest(event));
    this._mediator.execute(new ScheduleAutoPanFrameRequest());
  }
  onPointerUp(event) {
    this._mediator.execute(new DragMinimapFinalizeRequest(event));
    this._mediator.execute(new SelectionAreaFinalizeRequest(event));
    this._mediator.execute(new ReassignConnectionFinalizeRequest(event));
    this._mediator.execute(new CreateConnectionFinalizeRequest(event));
    this._mediator.execute(new ResizeNodeFinalizeRequest(event));
    this._mediator.execute(new RotateNodeFinalizeRequest(event));
    this._mediator.execute(new DragNodeFinalizeRequest(event));
    this._mediator.execute(new DragExternalItemFinalizeRequest(event));
    this._mediator.execute(new DropToGroupFinalizeRequest(event));
    this._mediator.execute(new DragCanvasFinalizeRequest(event));
    this._mediator.execute(new PinchToZoomFinalizeRequest(event));
    this._mediator.execute(new DragConnectionWaypointFinalizeRequest(event));
    this._mediator.execute(new EmitEndDragSequenceEventRequest());
  }
  finalizeDragSequence() {
    this._mediator.execute(new StopAutoPanRequest());
    this._mediator.execute(new EmitSelectionChangeEventRequest());
    this._result.clear();
    this._dragHandlerInjector.destroy();
  }
  ngOnDestroy() {
    this._mediator.execute(new StopAutoPanRequest());
    this._mediator.execute(new RemoveDndFromStoreRequest());
    super.unsubscribe();
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFDraggableDirective_BaseFactory;
    return function FDraggableDirective_Factory(__ngFactoryType__) {
      return (ɵFDraggableDirective_BaseFactory || (ɵFDraggableDirective_BaseFactory = ɵɵgetInheritedFactory(_FDraggableDirective)))(__ngFactoryType__ || _FDraggableDirective);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _FDraggableDirective,
    selectors: [["f-flow", "fDraggable", ""]],
    inputs: {
      disabled: [2, "fDraggableDisabled", "disabled", booleanAttribute],
      fMultiSelectTrigger: "fMultiSelectTrigger",
      fReassignConnectionTrigger: "fReassignConnectionTrigger",
      fCreateConnectionTrigger: "fCreateConnectionTrigger",
      fConnectionWaypointsTrigger: [1, "fConnectionWaypointsTrigger"],
      fMoveControlPointTrigger: "fMoveControlPointTrigger",
      fNodeResizeTrigger: "fNodeResizeTrigger",
      fNodeRotateTrigger: "fNodeRotateTrigger",
      fNodeMoveTrigger: "fNodeMoveTrigger",
      fCanvasMoveTrigger: "fCanvasMoveTrigger",
      fExternalItemTrigger: "fExternalItemTrigger",
      fEmitOnNodeIntersect: [2, "fEmitOnNodeIntersect", "fEmitOnNodeIntersect", booleanAttribute],
      vCellSize: [1, "vCellSize"],
      hCellSize: [1, "hCellSize"],
      fCellSizeWhileDragging: [1, "fCellSizeWhileDragging"]
    },
    outputs: {
      fSelectionChange: "fSelectionChange",
      fNodeIntersectedWithConnections: "fNodeIntersectedWithConnections",
      fNodeConnectionsIntersection: "fNodeConnectionsIntersection",
      fCreateNode: "fCreateNode",
      fMoveNodes: "fMoveNodes",
      fReassignConnection: "fReassignConnection",
      fCreateConnection: "fCreateConnection",
      fConnectionWaypointsChanged: "fConnectionWaypointsChanged",
      fDropToGroup: "fDropToGroup",
      fDragStarted: "fDragStarted",
      fDragEnded: "fDragEnded"
    },
    exportAs: ["fDraggable"],
    standalone: false,
    features: [ɵɵProvidersFeature([FDragHandlerResult, DragHandlerInjector]), ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FDraggableDirective, [{
    type: Directive,
    args: [{
      standalone: false,
      selector: "f-flow[fDraggable]",
      exportAs: "fDraggable",
      providers: [FDragHandlerResult, DragHandlerInjector]
    }]
  }], null, {
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute,
        alias: "fDraggableDisabled"
      }]
    }],
    fMultiSelectTrigger: [{
      type: Input
    }],
    fReassignConnectionTrigger: [{
      type: Input
    }],
    fCreateConnectionTrigger: [{
      type: Input
    }],
    fConnectionWaypointsTrigger: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fConnectionWaypointsTrigger",
        required: false
      }]
    }],
    fMoveControlPointTrigger: [{
      type: Input
    }],
    fNodeResizeTrigger: [{
      type: Input
    }],
    fNodeRotateTrigger: [{
      type: Input
    }],
    fNodeMoveTrigger: [{
      type: Input
    }],
    fCanvasMoveTrigger: [{
      type: Input
    }],
    fExternalItemTrigger: [{
      type: Input
    }],
    fSelectionChange: [{
      type: Output
    }],
    fNodeIntersectedWithConnections: [{
      type: Output
    }],
    fNodeConnectionsIntersection: [{
      type: Output,
      args: ["fNodeConnectionsIntersection"]
    }],
    fEmitOnNodeIntersect: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    fCreateNode: [{
      type: Output
    }],
    fMoveNodes: [{
      type: Output
    }],
    fReassignConnection: [{
      type: Output
    }],
    fCreateConnection: [{
      type: Output
    }],
    fConnectionWaypointsChanged: [{
      type: Output,
      args: ["fConnectionWaypointsChanged"]
    }],
    fDropToGroup: [{
      type: Output
    }],
    vCellSize: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "vCellSize",
        required: false
      }]
    }],
    hCellSize: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "hCellSize",
        required: false
      }]
    }],
    fCellSizeWhileDragging: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fCellSizeWhileDragging",
        required: false
      }]
    }],
    fDragStarted: [{
      type: Output
    }],
    fDragEnded: [{
      type: Output
    }]
  });
})();
var F_DRAGGABLE_PROVIDERS = [...DRAG_CANVAS_PROVIDERS, ...DRAG_CONNECTIONS_PROVIDERS, ...DRAG_AND_DROP_COMMON_PROVIDERS, ...DRAG_SELECT_BY_POINTER_PROVIDERS, ...DRAG_EXTERNAL_ITEM_PROVIDERS, ...DRAG_AUTO_PAN_PROVIDERS, ...DRAG_MINIMAP_PROVIDERS, ...NODE_PROVIDERS, ...DRAG_DROP_TO_GROUP_PROVIDERS, ...NODE_RESIZE_PROVIDERS, ...NODE_ROTATE_PROVIDERS, ...DRAG_SELECTION_AREA_PROVIDERS, ...PINCH_TO_ZOOM_PROVIDERS];
var RemoveConnectionWaypoint = class RemoveConnectionWaypoint2 {
  _store = inject(FComponentsStore);
  handle({
    waypointIndex,
    connectionId
  }) {
    const connection = this._store.connections.require(connectionId);
    const current = connection.fWaypoints()?.waypoints().slice();
    if (!current) {
      throw new Error("Connection waypoints not found");
    }
    current.splice(waypointIndex, 1);
    connection.fWaypoints()?.waypoints.set(current);
    this._store.fDraggable?.fConnectionWaypointsChanged.emit(this._changeEvent(connection));
  }
  _changeEvent(connection) {
    return new FConnectionWaypointsChangedEvent(connection.fId(), connection.fWaypoints()?.waypoints() || []);
  }
  static ɵfac = function RemoveConnectionWaypoint_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RemoveConnectionWaypoint2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RemoveConnectionWaypoint2,
    factory: RemoveConnectionWaypoint2.ɵfac
  });
};
RemoveConnectionWaypoint = __decorate([FExecutionRegister(RemoveConnectionWaypointRequest)], RemoveConnectionWaypoint);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RemoveConnectionWaypoint, [{
    type: Injectable
  }], null, null);
})();
var RemoveSnapConnectionFromStoreRequest = class {
  static fToken = Symbol("RemoveSnapConnectionFromStoreRequest");
};
var RemoveSnapConnectionFromStore = class RemoveSnapConnectionFromStore2 {
  _store = inject(FComponentsStore);
  handle(_request) {
    this._store.connections.removeInstanceForSnap();
  }
  static ɵfac = function RemoveSnapConnectionFromStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RemoveSnapConnectionFromStore2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RemoveSnapConnectionFromStore2,
    factory: RemoveSnapConnectionFromStore2.ɵfac
  });
};
RemoveSnapConnectionFromStore = __decorate([FExecutionRegister(RemoveSnapConnectionFromStoreRequest)], RemoveSnapConnectionFromStore);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RemoveSnapConnectionFromStore, [{
    type: Injectable
  }], null, null);
})();
var F_CONNECTION_FEATURES = [ConnectionRedrawState, ConnectionWorkerState, AddConnectionForCreateToStore, AddConnectionMarkerToStore, AddConnectionToStore, AddSnapConnectionToStore, CreateConnectionMarkers, ApplyConnectionWorkerResult, ApplyConnectionRender, BuildConnectionLine, BuildConnectionWorkerBatch, BuildConnectionWorkerPayloadItem, CompleteConnectionRedraw, DisableConnectionWorker, EnsureConnectionWorker, HandleConnectionWorkerMessage, IsConnectionRedrawCurrent, IsConnectionWorkerEnabled, MarkConnectionConnectorsAsConnected, RedrawConnections, RenderConnection, RenderConnectionFromGeometry, RenderConnectionWithLine, ResolveConnectionEndpointRect, ResolveConnectionEndpointRotationContext, ResolveConnectionEndpoints, ResolveConnectionGeometry, ResetConnectionWorkerRuntime, RunConnectionRedrawSlice, RunConnectionWorker, RunConnectionWorkerBatch, ShouldUseConnectionWorker, StartConnectionRedraw, StartConnectionWorkerRedraw, RemoveConnectionForCreateFromStore, RemoveConnectionFromStore, RemoveConnectionMarkerFromStore, RemoveSnapConnectionFromStore, RemoveConnectionWaypoint];
var AddConnectorToStoreRequest = class {
  instance;
  static fToken = Symbol("AddConnectorToStoreRequest");
  constructor(instance) {
    this.instance = instance;
  }
};
var AddConnectorToStore = class AddConnectorToStore2 {
  _store = inject(FComponentsStore);
  _mediator = inject(FMediator);
  handle({
    instance
  }) {
    switch (instance.kind) {
      case "input":
        this._addInput(instance);
        break;
      case "output":
        this._addOutput(instance);
        break;
      case "outlet":
        this._addOutlet(instance);
        break;
      default:
        throw new Error(`Unknown connector kind: ${instance.kind}`);
    }
  }
  _addInput(component) {
    this._store.inputs.add(component);
    this._store.emitNodeChanges();
    this._geometryRegister(component);
  }
  _addOutput(component) {
    this._store.outputs.add(component);
    this._store.emitNodeChanges();
    this._geometryRegister(component);
  }
  _addOutlet(component) {
    this._store.outlets.add(component);
    this._store.emitNodeChanges();
    this._geometryRegister(component);
  }
  _geometryRegister(component) {
    this._mediator.execute(new RegisterFCacheConnectorRequest(component.fId(), component.fNodeId, component.kind, component.hostElement));
  }
  static ɵfac = function AddConnectorToStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || AddConnectorToStore2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: AddConnectorToStore2,
    factory: AddConnectorToStore2.ɵfac
  });
};
AddConnectorToStore = __decorate([FExecutionRegister(AddConnectorToStoreRequest)], AddConnectorToStore);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AddConnectorToStore, [{
    type: Injectable
  }], null, null);
})();
var CalculateClosestConnectorRequest = class {
  position;
  connectorRefs;
  static fToken = Symbol("CalculateClosestConnectorRequest");
  constructor(position, connectorRefs) {
    this.position = position;
    this.connectorRefs = connectorRefs;
  }
};
var CalculateClosestConnector = class CalculateClosestConnector2 {
  handle({
    position,
    connectorRefs
  }) {
    let result;
    let minDistance = Infinity;
    for (const ref of connectorRefs) {
      const distance = this._distanceToRect(position, ref.rect);
      if (distance < minDistance) {
        minDistance = distance;
        result = ref;
      }
    }
    return result ? __spreadProps(__spreadValues({}, result), {
      distance: minDistance
    }) : void 0;
  }
  _distanceToRect(point, {
    x,
    y,
    width,
    height
  }) {
    const closestX = this._clamp(point.x, x, x + width);
    const closestY = this._clamp(point.y, y, y + height);
    const dx = point.x - closestX;
    const dy = point.y - closestY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  _clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  static ɵfac = function CalculateClosestConnector_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CalculateClosestConnector2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CalculateClosestConnector2,
    factory: CalculateClosestConnector2.ɵfac
  });
};
CalculateClosestConnector = __decorate([FExecutionRegister(CalculateClosestConnectorRequest)], CalculateClosestConnector);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalculateClosestConnector, [{
    type: Injectable
  }], null, null);
})();
var FindConnectableConnectorUsingPriorityAndPositionRequest = class {
  pointerPosition;
  connectableConnectors;
  static fToken = Symbol("FindConnectableConnectorUsingPriorityAndPositionRequest");
  constructor(pointerPosition, connectableConnectors) {
    this.pointerPosition = pointerPosition;
    this.connectableConnectors = connectableConnectors;
  }
};
var FindConnectableConnectorUsingPriorityAndPosition = class FindConnectableConnectorUsingPriorityAndPosition2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  _browser = inject(BrowserService);
  get _transform() {
    return this._store.transform;
  }
  get _flowHost() {
    return this._store.flowHost;
  }
  get _fNodes() {
    return this._store.nodes.getAll();
  }
  get _snapConnection() {
    return this._store.connections.getForSnap();
  }
  handle(payload) {
    const connectors = this._findConnectorAtPosition(payload);
    return connectors.length > 0 ? connectors[0] : void 0;
  }
  _findConnectorAtPosition(request) {
    const result = [];
    result.push(...this._filterConnectorsThatLocatedAtPosition(request));
    const closestConnector = this._isSnapConnectionEnabledAndHasClosestConnector(request);
    if (closestConnector) {
      result.unshift(closestConnector.connector);
    }
    const fInput = this._getFirstConnectableConnectorOfNodeAtPosition(request);
    if (fInput) {
      result.push(fInput);
    }
    return result;
  }
  _filterConnectorsThatLocatedAtPosition(request) {
    return request.connectableConnectors.filter((x) => {
      return RectExtensions.isIncludePoint(x.rect, this._calculatePointerInFlow(request.pointerPosition));
    }).map((x) => x.connector);
  }
  _calculatePointerInFlow(position) {
    return calculatePointerInFlow(position, this._flowHost, this._transform);
  }
  _isSnapConnectionEnabledAndHasClosestConnector(request) {
    if (!this._snapConnection) {
      return void 0;
    }
    const closestConnector = this._mediator.execute(new CalculateClosestConnectorRequest(this._calculatePointerInFlow(request.pointerPosition), request.connectableConnectors));
    return this._isValidClosestInput(closestConnector) ? closestConnector : void 0;
  }
  _isValidClosestInput(closestConnector) {
    return !!closestConnector && closestConnector.distance < this._snapConnection.fSnapThreshold;
  }
  //if node placed in position and fConnectOnNode is true, return the first connectable connector of the node
  _getFirstConnectableConnectorOfNodeAtPosition(request) {
    return this._getElementsFromPoint(request.pointerPosition).map((x) => this._findConnectableNode(x)).filter((x) => !!x).map((x) => this._findFirstConnectableConnectorOfNode(request.connectableConnectors, x)).find((x) => !!x);
  }
  _getElementsFromPoint(position) {
    return this._browser.document.elementsFromPoint(position.x, position.y);
  }
  _findConnectableNode(element) {
    return this._fNodes.find((x) => x.isContains(element) && x.fConnectOnNode());
  }
  _findFirstConnectableConnectorOfNode(connectableInputs, fNode) {
    return connectableInputs.find((x) => x.connector.fNodeId === fNode.fId())?.connector;
  }
  static ɵfac = function FindConnectableConnectorUsingPriorityAndPosition_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || FindConnectableConnectorUsingPriorityAndPosition2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: FindConnectableConnectorUsingPriorityAndPosition2,
    factory: FindConnectableConnectorUsingPriorityAndPosition2.ɵfac
  });
};
FindConnectableConnectorUsingPriorityAndPosition = __decorate([FExecutionRegister(FindConnectableConnectorUsingPriorityAndPositionRequest)], FindConnectableConnectorUsingPriorityAndPosition);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FindConnectableConnectorUsingPriorityAndPosition, [{
    type: Injectable
  }], null, null);
})();
var CalculateTargetConnectorsToConnectRequest = class {
  source;
  pointer;
  static fToken = Symbol("CalculateTargetConnectorsToConnectRequest");
  constructor(source, pointer) {
    this.source = source;
    this.pointer = pointer;
  }
};
var GetConnectorRectReferenceRequest = class {
  connector;
  static fToken = Symbol("GetConnectorRectReferenceRequest");
  constructor(connector) {
    this.connector = connector;
  }
};
var GetConnectorRectReference = class GetConnectorRectReference2 {
  _mediator = inject(FMediator);
  handle({
    connector
  }) {
    return {
      connector,
      rect: this._getRect(connector)
    };
  }
  _getRect(x) {
    return this._mediator.execute(new GetNormalizedConnectorRectRequest(x.hostElement));
  }
  static ɵfac = function GetConnectorRectReference_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || GetConnectorRectReference2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: GetConnectorRectReference2,
    factory: GetConnectorRectReference2.ɵfac
  });
};
GetConnectorRectReference = __decorate([FExecutionRegister(GetConnectorRectReferenceRequest)], GetConnectorRectReference);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GetConnectorRectReference, [{
    type: Injectable
  }], null, null);
})();
var AddNodeToStoreRequest = class {
  nodeOrGroup;
  static fToken = Symbol("AddNodeToStoreRequest");
  constructor(nodeOrGroup) {
    this.nodeOrGroup = nodeOrGroup;
  }
};
var AddNodeToStore = class AddNodeToStore2 {
  _store = inject(FComponentsStore);
  _mediator = inject(FMediator);
  handle({
    nodeOrGroup
  }) {
    this._store.nodes.add(nodeOrGroup);
    this._mediator.execute(new RegisterFCacheNodeRequest(nodeOrGroup.fId(), nodeOrGroup.hostElement, nodeOrGroup));
    this._store.emitNodeChanges();
  }
  static ɵfac = function AddNodeToStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || AddNodeToStore2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: AddNodeToStore2,
    factory: AddNodeToStore2.ɵfac
  });
};
AddNodeToStore = __decorate([FExecutionRegister(AddNodeToStoreRequest)], AddNodeToStore);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AddNodeToStore, [{
    type: Injectable
  }], null, null);
})();
var CalculateInputConnectionsRequest = class {
  nodeOrGroup;
  static fToken = Symbol("CalculateInputConnectionsRequest");
  constructor(nodeOrGroup) {
    this.nodeOrGroup = nodeOrGroup;
  }
};
var CalculateInputConnections = class CalculateInputConnections2 {
  _store = inject(FComponentsStore);
  handle({
    nodeOrGroup
  }) {
    const ids = this._collectInputIds(nodeOrGroup);
    return this._collectConnections(ids);
  }
  _collectInputIds(nodeOrGroup) {
    const ids = /* @__PURE__ */ new Set();
    const connectors = this._store.inputs.getAll();
    for (const connector of connectors) {
      if (nodeOrGroup.isContains(connector.hostElement)) {
        ids.add(connector.fId());
      }
    }
    return ids;
  }
  _collectConnections(ids) {
    const result = [];
    const connections = this._store.connections.getAll();
    for (const conn of connections) {
      if (ids.has(conn.fInputId())) {
        result.push(conn);
      }
    }
    return result;
  }
  static ɵfac = function CalculateInputConnections_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CalculateInputConnections2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CalculateInputConnections2,
    factory: CalculateInputConnections2.ɵfac
  });
};
CalculateInputConnections = __decorate([FExecutionRegister(CalculateInputConnectionsRequest)], CalculateInputConnections);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalculateInputConnections, [{
    type: Injectable
  }], null, null);
})();
var CalculateConnectableSideByConnectedPositionsRequest = class {
  connector;
  pointerPosition;
  static fToken = Symbol("CalculateConnectableSideByConnectedPositionsRequest");
  constructor(connector, pointerPosition) {
    this.connector = connector;
    this.pointerPosition = pointerPosition;
  }
};
var SNAP_EPS = 2;
var SideMask;
(function(SideMask2) {
  SideMask2[SideMask2["NONE"] = 0] = "NONE";
  SideMask2[SideMask2["LEFT"] = 1] = "LEFT";
  SideMask2[SideMask2["RIGHT"] = 2] = "RIGHT";
  SideMask2[SideMask2["TOP"] = 4] = "TOP";
  SideMask2[SideMask2["BOTTOM"] = 8] = "BOTTOM";
  SideMask2[SideMask2["ALL"] = 15] = "ALL";
})(SideMask || (SideMask = {}));
function determineSide(selfX, selfY, avgX, avgY, allowed) {
  const allowedMask = _toSideMask(allowed);
  const dx = avgX - selfX;
  const dy = avgY - selfY;
  const ideal = _pickIdealSide(dx, dy);
  if (_isAllowed(ideal, allowedMask)) {
    return ideal;
  }
  return _pickFallbackSide(dx, dy, allowedMask, ideal);
}
function _toSideMask(allowed) {
  if (!allowed || allowed.length === 0) return SideMask.ALL;
  let mask = SideMask.NONE;
  for (let i = 0; i < allowed.length; i++) {
    switch (allowed[i]) {
      case EFConnectableSide.LEFT:
        mask |= SideMask.LEFT;
        break;
      case EFConnectableSide.RIGHT:
        mask |= SideMask.RIGHT;
        break;
      case EFConnectableSide.TOP:
        mask |= SideMask.TOP;
        break;
      case EFConnectableSide.BOTTOM:
        mask |= SideMask.BOTTOM;
        break;
    }
  }
  return mask || SideMask.ALL;
}
function _pickIdealSide(dx, dy) {
  const ax = dx < 0 ? -dx : dx;
  const ay = dy < 0 ? -dy : dy;
  if (ax - ay > SNAP_EPS) {
    return dx < 0 ? EFConnectableSide.LEFT : EFConnectableSide.RIGHT;
  }
  if (ay - ax > SNAP_EPS) {
    return dy < 0 ? EFConnectableSide.TOP : EFConnectableSide.BOTTOM;
  }
  return dy < 0 ? EFConnectableSide.TOP : EFConnectableSide.BOTTOM;
}
function _isAllowed(side, mask) {
  switch (side) {
    case EFConnectableSide.LEFT:
      return (mask & SideMask.LEFT) !== 0;
    case EFConnectableSide.RIGHT:
      return (mask & SideMask.RIGHT) !== 0;
    case EFConnectableSide.TOP:
      return (mask & SideMask.TOP) !== 0;
    case EFConnectableSide.BOTTOM:
      return (mask & SideMask.BOTTOM) !== 0;
    default:
      return true;
  }
}
function _pickFallbackSide(dx, dy, allowedMask, ideal) {
  let bestSide = ideal;
  let bestScore = -Infinity;
  if (allowedMask & SideMask.RIGHT) {
    const s = dx;
    if (s > bestScore) {
      bestScore = s;
      bestSide = EFConnectableSide.RIGHT;
    }
  }
  if (allowedMask & SideMask.LEFT) {
    const s = -dx;
    if (s > bestScore) {
      bestScore = s;
      bestSide = EFConnectableSide.LEFT;
    }
  }
  if (allowedMask & SideMask.BOTTOM) {
    const s = dy;
    if (s > bestScore) {
      bestScore = s;
      bestSide = EFConnectableSide.BOTTOM;
    }
  }
  if (allowedMask & SideMask.TOP) {
    const s = -dy;
    if (s > bestScore) {
      bestScore = s;
      bestSide = EFConnectableSide.TOP;
    }
  }
  return bestSide;
}
function isCalculateMode(side) {
  return side === EFConnectableSide.CALCULATE || side === EFConnectableSide.CALCULATE_HORIZONTAL || side === EFConnectableSide.CALCULATE_VERTICAL;
}
var CALCULATABLE_SIDES = {
  [EFConnectableSide.CALCULATE]: [EFConnectableSide.TOP, EFConnectableSide.BOTTOM, EFConnectableSide.LEFT, EFConnectableSide.RIGHT],
  [EFConnectableSide.CALCULATE_HORIZONTAL]: [EFConnectableSide.LEFT, EFConnectableSide.RIGHT],
  [EFConnectableSide.CALCULATE_VERTICAL]: [EFConnectableSide.TOP, EFConnectableSide.BOTTOM]
};
var CalculateConnectableSideByConnectedPositions = class CalculateConnectableSideByConnectedPositions2 {
  _mediator = inject(FMediator);
  /**
   * Entry point (hot path). Avoids intermediate arrays and redundant allocations.
   *
   * @param request - Contains the connector and optionally allowed sides.
   * @returns {EFConnectableSide} - The chosen connectable side.
   */
  handle({
    connector,
    pointerPosition
  }) {
    const mode = connector.userFConnectableSide;
    const selfCenter = this._getConnectorRect(connector.hostElement).gravityCenter;
    const acc = this._accumulateConnectedCenters(connector.hostElement, connector.toConnector, pointerPosition);
    const avgX = acc.sumX / acc.count;
    const avgY = acc.sumY / acc.count;
    return determineSide(selfCenter.x, selfCenter.y, avgX, avgY, CALCULATABLE_SIDES[mode]);
  }
  _accumulateConnectedCenters(selfHost, connected, pointerPosition) {
    let sumX = pointerPosition?.x || 0;
    let sumY = pointerPosition?.y || 0;
    let count = pointerPosition ? 1 : 0;
    if (connected && connected.length) {
      for (let i = 0; i < connected.length; i++) {
        const el = connected[i].hostElement;
        if (el === selfHost) continue;
        const c = this._getConnectorRect(el).gravityCenter;
        sumX += c.x;
        sumY += c.y;
        count++;
      }
    }
    return {
      sumX,
      sumY,
      count
    };
  }
  _getConnectorRect(element) {
    return this._mediator.execute(new GetNormalizedElementRectRequest(element));
  }
  static ɵfac = function CalculateConnectableSideByConnectedPositions_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CalculateConnectableSideByConnectedPositions2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CalculateConnectableSideByConnectedPositions2,
    factory: CalculateConnectableSideByConnectedPositions2.ɵfac
  });
};
CalculateConnectableSideByConnectedPositions = __decorate([FExecutionRegister(CalculateConnectableSideByConnectedPositionsRequest)], CalculateConnectableSideByConnectedPositions);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalculateConnectableSideByConnectedPositions, [{
    type: Injectable
  }], null, null);
})();
var CalculateConnectableSideByInternalPositionRequest = class {
  connector;
  static fToken = Symbol("CalculateConnectableSideByInternalPositionRequest");
  constructor(connector) {
    this.connector = connector;
  }
};
var AddDndToStoreRequest = class {
  fComponent;
  static fToken = Symbol("AddDndToStoreRequest");
  constructor(fComponent) {
    this.fComponent = fComponent;
  }
};
var AddDndToStore = class AddDndToStore2 {
  _store = inject(FComponentsStore);
  handle(request) {
    this._store.fDraggable = request.fComponent;
  }
  static ɵfac = function AddDndToStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || AddDndToStore2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: AddDndToStore2,
    factory: AddDndToStore2.ɵfac
  });
};
AddDndToStore = __decorate([FExecutionRegister(AddDndToStoreRequest)], AddDndToStore);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AddDndToStore, [{
    type: Injectable
  }], null, null);
})();
var OnPointerMoveRequest = class {
  event;
  static fToken = Symbol("OnPointerMoveRequest");
  constructor(event) {
    this.event = event;
  }
};
var OnPointerMove = class OnPointerMove2 {
  _store = inject(FComponentsStore);
  _dragContext = inject(FDraggableDataContext);
  get _hostElement() {
    return this._store.fDraggable?.hostElement;
  }
  handle({
    event
  }) {
    this._dragContext.rememberPointerPosition(event);
    this._setDifferenceToDraggableItems(this._getDifferenceBetweenPointerAndPointerDown(event), event);
  }
  _setDifferenceToDraggableItems(difference, event) {
    this._dragContext.draggableItems.forEach((item) => {
      item.onPointerMove(__spreadValues({}, difference), event);
    });
  }
  _getDifferenceBetweenPointerAndPointerDown(event) {
    return this._getPointerPositionInCanvas(event).div(this._dragContext.onPointerDownScale).sub(this._dragContext.onPointerDownPosition);
  }
  _getPointerPositionInCanvas(event) {
    return Point.fromPoint(event.getPosition()).elementTransform(this._hostElement);
  }
  static ɵfac = function OnPointerMove_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || OnPointerMove2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: OnPointerMove2,
    factory: OnPointerMove2.ɵfac
  });
};
OnPointerMove = __decorate([FExecutionRegister(OnPointerMoveRequest)], OnPointerMove);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OnPointerMove, [{
    type: Injectable
  }], null, null);
})();
var InitializeDragSequenceRequest = class {
  static fToken = Symbol("InitializeDragSequenceRequest");
};
var InitializeDragSequence = class InitializeDragSequence2 {
  _dragContext = inject(FDraggableDataContext);
  handle(_) {
    this._dragContext.reset();
  }
  static ɵfac = function InitializeDragSequence_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || InitializeDragSequence2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: InitializeDragSequence2,
    factory: InitializeDragSequence2.ɵfac
  });
};
InitializeDragSequence = __decorate([FExecutionRegister(InitializeDragSequenceRequest)], InitializeDragSequence);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InitializeDragSequence, [{
    type: Injectable
  }], null, null);
})();
var IsDragStartedRequest = class {
  static fToken = Symbol("IsDragStartedRequest");
};
var IsDragStarted = class IsDragStarted2 {
  _store = inject(FComponentsStore);
  handle(_) {
    return !!this._store.fDraggable?.isDragStarted;
  }
  static ɵfac = function IsDragStarted_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || IsDragStarted2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: IsDragStarted2,
    factory: IsDragStarted2.ɵfac
  });
};
IsDragStarted = __decorate([FExecutionRegister(IsDragStartedRequest)], IsDragStarted);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(IsDragStarted, [{
    type: Injectable
  }], null, null);
})();
var PrepareDragSequenceRequest = class {
  static fToken = Symbol("PrepareDragSequenceRequest");
};
var PrepareDragSequence = class PrepareDragSequence2 {
  _mediator = inject(FMediator);
  _dragContext = inject(FDraggableDataContext);
  handle(_) {
    this._callPrepareDragSequence();
    this._mediator.execute(new EmitStartDragSequenceEventRequest());
  }
  _callPrepareDragSequence() {
    this._dragContext.draggableItems.forEach((x) => x.prepareDragSequence?.());
  }
  static ɵfac = function PrepareDragSequence_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || PrepareDragSequence2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: PrepareDragSequence2,
    factory: PrepareDragSequence2.ɵfac
  });
};
PrepareDragSequence = __decorate([FExecutionRegister(PrepareDragSequenceRequest)], PrepareDragSequence);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PrepareDragSequence, [{
    type: Injectable
  }], null, null);
})();
var RemoveDndFromStoreRequest = class {
  static fToken = Symbol("RemoveDndFromStoreRequest");
};
var RemoveDndFromStore = class RemoveDndFromStore2 {
  _store = inject(FComponentsStore);
  handle(_) {
    this._store.fDraggable = void 0;
  }
  static ɵfac = function RemoveDndFromStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RemoveDndFromStore2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RemoveDndFromStore2,
    factory: RemoveDndFromStore2.ɵfac
  });
};
RemoveDndFromStore = __decorate([FExecutionRegister(RemoveDndFromStoreRequest)], RemoveDndFromStore);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RemoveDndFromStore, [{
    type: Injectable
  }], null, null);
})();
var F_DRAGGABLE_FEATURES = [AddDndToStore, OnPointerMove, InitializeDragSequence, PrepareDragSequence, IsDragStarted, RemoveDndFromStore];
var CONNECTABLE_SIDE_EPSILON = new InjectionToken("CONNECTABLE_SIDE_EPSILON");
var CalculateConnectableSideByInternalPosition = class CalculateConnectableSideByInternalPosition2 {
  _mediator = inject(FMediator);
  /**
   * Stores the last computed side per connector.
   * WeakMap ensures entries are garbage-collected with the connector objects.
   */
  _lastSide = /* @__PURE__ */ new WeakMap();
  /** Pixel threshold to prevent side switching unless the new side is sufficiently better. */
  _epsilon = Math.max(0, inject(CONNECTABLE_SIDE_EPSILON, {
    optional: true
  }) ?? 2);
  /**
   * Entry point: returns the connectable side for a given connector.
   * If a drag is in progress, returns the last memorized side for stability.
   */
  handle({
    connector
  }) {
    if (this._isDragging()) {
      const cached = this._lastSide.get(connector);
      if (cached !== void 0) return cached;
      const computed2 = this._getSideByDelta(connector.hostElement, connector.fNodeHost, connector);
      this._lastSide.set(connector, computed2);
      return computed2;
    }
    const side = this._getSideByDelta(connector.hostElement, connector.fNodeHost, connector);
    this._lastSide.set(connector, side);
    return side;
  }
  /**
   * Determines the side of the connector relative to the node host by
   * comparing distances from the connector's gravity center to each host edge.
   *
   * Hysteresis rule:
   * If the previously chosen side is within `epsilon` pixels of the new best side,
   * keep the previous side to avoid flicker.
   *
   * @param connectorHost - The connector element (HTML or SVG).
   * @param nodeHost - The parent node element (HTML or SVG).
   * @param connectorKey - The connector object, used as WeakMap key.
   * @returns The most stable connectable side.
   */
  _getSideByDelta(connectorHost, nodeHost, connectorKey) {
    const childRect = RectExtensions.fromElement(connectorHost);
    const parentRect = nodeHost.getBoundingClientRect();
    const cx = childRect.gravityCenter.x;
    const cy = childRect.gravityCenter.y;
    const deltaLeft = cx - parentRect.left;
    const deltaRight = parentRect.right - cx;
    const deltaTop = cy - parentRect.top;
    const deltaBottom = parentRect.bottom - cy;
    let minIdx = 0;
    let minVal = deltaLeft;
    const candidates = [deltaLeft, deltaRight, deltaTop, deltaBottom];
    for (let i = 1; i < 4; i++) {
      const v = candidates[i];
      if (v < minVal) {
        minVal = v;
        minIdx = i;
      }
    }
    let candidate = minIdx === 0 ? EFConnectableSide.LEFT : minIdx === 1 ? EFConnectableSide.RIGHT : minIdx === 2 ? EFConnectableSide.TOP : EFConnectableSide.BOTTOM;
    const prev = this._lastSide.get(connectorKey);
    if (prev !== void 0 && prev !== candidate) {
      const prevIdx = prev === EFConnectableSide.LEFT ? 0 : prev === EFConnectableSide.RIGHT ? 1 : prev === EFConnectableSide.TOP ? 2 : 3;
      const prevDelta = prevIdx === 0 ? deltaLeft : prevIdx === 1 ? deltaRight : prevIdx === 2 ? deltaTop : deltaBottom;
      const advantage = prevDelta - minVal;
      if (advantage <= this._epsilon) {
        candidate = prev;
      }
    }
    return candidate;
  }
  /** Returns true if a drag operation is currently active. */
  _isDragging() {
    return this._mediator.execute(new IsDragStartedRequest());
  }
  static ɵfac = function CalculateConnectableSideByInternalPosition_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CalculateConnectableSideByInternalPosition2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CalculateConnectableSideByInternalPosition2,
    factory: CalculateConnectableSideByInternalPosition2.ɵfac
  });
};
CalculateConnectableSideByInternalPosition = __decorate([FExecutionRegister(CalculateConnectableSideByInternalPositionRequest)], CalculateConnectableSideByInternalPosition);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalculateConnectableSideByInternalPosition, [{
    type: Injectable
  }], null, null);
})();
var CalculateConnectorsConnectableSidesRequest = class {
  nodeOrGroup;
  static fToken = Symbol("CalculateConnectorsConnectableSidesRequest");
  constructor(nodeOrGroup) {
    this.nodeOrGroup = nodeOrGroup;
  }
};
var CalculateConnectorsConnectableSides = class CalculateConnectorsConnectableSides2 {
  _mediator = inject(FMediator);
  /**
   * Orchestrates side calculation for all connectors of the given node.
   */
  handle({
    nodeOrGroup
  }) {
    const connectors = nodeOrGroup.connectors;
    const len = connectors.length;
    for (let i = 0; i < len; i++) {
      const connection = connectors[i];
      connection.fConnectableSide = this._resolveSideForConnectorFast(connection);
    }
    const toRecalc = /* @__PURE__ */ new Set();
    for (let i = 0; i < len; i++) {
      const source = connectors[i];
      const outs = source.toConnector;
      if (outs && outs.length) {
        for (let j = 0, m = outs.length; j < m; j++) {
          const target = outs[j];
          const userSide = target.userFConnectableSide;
          if (isCalculateMode(userSide)) {
            toRecalc.add(target);
          }
        }
      }
    }
    if (toRecalc.size > 0) {
      toRecalc.forEach((target) => {
        target.fConnectableSide = this._calculateByConnectedPositions(target);
      });
    }
  }
  /**
   * Resolves the connectable side for a connector quickly.
   * Avoids intermediate arrays and redundant allocations.
   */
  _resolveSideForConnectorFast(connector) {
    const mode = connector.userFConnectableSide;
    if (mode === EFConnectableSide.AUTO) {
      return this._mediator.execute(new CalculateConnectableSideByInternalPositionRequest(connector));
    }
    if (isCalculateMode(mode)) {
      return this._calculateByConnectedPositions(connector);
    }
    return mode;
  }
  /** Delegates to the connected-positions calculation execution. */
  _calculateByConnectedPositions(connector) {
    return this._mediator.execute(new CalculateConnectableSideByConnectedPositionsRequest(connector));
  }
  static ɵfac = function CalculateConnectorsConnectableSides_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CalculateConnectorsConnectableSides2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CalculateConnectorsConnectableSides2,
    factory: CalculateConnectorsConnectableSides2.ɵfac
  });
};
CalculateConnectorsConnectableSides = __decorate([FExecutionRegister(CalculateConnectorsConnectableSidesRequest)], CalculateConnectorsConnectableSides);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalculateConnectorsConnectableSides, [{
    type: Injectable
  }], null, null);
})();
var CalculateNodesBoundingBoxRequest = class {
  static fToken = Symbol("CalculateNodesBoundingBoxRequest");
};
var CalculateNodesBoundingBox = class CalculateNodesBoundingBox2 {
  _store = inject(FComponentsStore);
  handle(_) {
    return RectExtensions.union(this._nodesRects());
  }
  _nodesRects() {
    return this._store.nodes.getAll().map((x) => RectExtensions.fromElement(x.hostElement));
  }
  static ɵfac = function CalculateNodesBoundingBox_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CalculateNodesBoundingBox2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CalculateNodesBoundingBox2,
    factory: CalculateNodesBoundingBox2.ɵfac
  });
};
CalculateNodesBoundingBox = __decorate([FExecutionRegister(CalculateNodesBoundingBoxRequest)], CalculateNodesBoundingBox);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalculateNodesBoundingBox, [{
    type: Injectable
  }], null, null);
})();
var CalculateNodesBoundingBoxNormalizedPositionRequest = class {
  fNodes;
  static fToken = Symbol("CalculateNodesBoundingBoxNormalizedPositionRequest");
  constructor(fNodes) {
    this.fNodes = fNodes;
  }
};
var CalculateNodesBoundingBoxNormalizedPosition = class CalculateNodesBoundingBoxNormalizedPosition2 {
  _store = inject(FComponentsStore);
  _mediator = inject(FMediator);
  handle(request) {
    return RectExtensions.union(this._getNodesRects(request.fNodes || this._store.nodes.getAll()));
  }
  _getNodesRects(fNodes) {
    return fNodes.map((node) => this._getNodeRect(node));
  }
  _getNodeRect(node) {
    const cached = this._mediator.execute(new GetCachedFCacheRectRequest(node.hostElement));
    if (cached) {
      return this._getElementRect(node, cached);
    }
    const normalizedRect = this._mediator.execute(new GetNormalizedElementRectRequest(node.hostElement));
    return this._getElementRect(node, normalizedRect);
  }
  _getElementRect(node, rect) {
    return RectExtensions.initialize(node._position.x, node._position.y, rect.width, rect.height);
  }
  static ɵfac = function CalculateNodesBoundingBoxNormalizedPosition_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CalculateNodesBoundingBoxNormalizedPosition2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CalculateNodesBoundingBoxNormalizedPosition2,
    factory: CalculateNodesBoundingBoxNormalizedPosition2.ɵfac
  });
};
CalculateNodesBoundingBoxNormalizedPosition = __decorate([FExecutionRegister(CalculateNodesBoundingBoxNormalizedPositionRequest)], CalculateNodesBoundingBoxNormalizedPosition);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalculateNodesBoundingBoxNormalizedPosition, [{
    type: Injectable
  }], null, null);
})();
var CalculateOutputConnectionsRequest = class {
  nodeOrGroup;
  static fToken = Symbol("CalculateOutputConnectionsRequest");
  constructor(nodeOrGroup) {
    this.nodeOrGroup = nodeOrGroup;
  }
};
var CalculateOutputConnections = class CalculateOutputConnections2 {
  _store = inject(FComponentsStore);
  handle({
    nodeOrGroup
  }) {
    const ids = this._collectOutputIds(nodeOrGroup);
    return this._collectConnections(ids);
  }
  _collectOutputIds(nodeOrGroup) {
    const ids = /* @__PURE__ */ new Set();
    const connectors = this._store.outputs.getAll();
    for (const connector of connectors) {
      if (nodeOrGroup.isContains(connector.hostElement)) {
        ids.add(connector.fId());
      }
    }
    return ids;
  }
  _collectConnections(ids) {
    const result = [];
    const connections = this._store.connections.getAll();
    for (const conn of connections) {
      if (ids.has(conn.fOutputId())) {
        result.push(conn);
      }
    }
    return result;
  }
  static ɵfac = function CalculateOutputConnections_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CalculateOutputConnections2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CalculateOutputConnections2,
    factory: CalculateOutputConnections2.ɵfac
  });
};
CalculateOutputConnections = __decorate([FExecutionRegister(CalculateOutputConnectionsRequest)], CalculateOutputConnections);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalculateOutputConnections, [{
    type: Injectable
  }], null, null);
})();
var FitToChildNodesAndGroupsRequest = class {
  nodeOrGroup;
  static fToken = Symbol("FitToChildNodesAndGroupsRequest");
  constructor(nodeOrGroup) {
    this.nodeOrGroup = nodeOrGroup;
  }
};
var GetNodePaddingRequest = class {
  fNode;
  rect;
  static fToken = Symbol("GetNodePaddingRequest");
  constructor(fNode, rect) {
    this.fNode = fNode;
    this.rect = rect;
  }
};
var GetNodePadding = class GetNodePadding2 {
  _browser = inject(BrowserService);
  handle(request) {
    return request.fNode.fIncludePadding() ? this._getPaddingData(request.fNode, request.rect) : [0, 0, 0, 0];
  }
  _getPaddingData(node, rect) {
    const style = this._browser.window.getComputedStyle(node.hostElement);
    return [this._browser.toPixels(style.paddingLeft, rect.width, rect.height, style.fontSize), this._browser.toPixels(style.paddingTop, rect.width, rect.height, style.fontSize), this._browser.toPixels(style.paddingRight, rect.width, rect.height, style.fontSize), this._browser.toPixels(style.paddingBottom, rect.width, rect.height, style.fontSize)];
  }
  static ɵfac = function GetNodePadding_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || GetNodePadding2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: GetNodePadding2,
    factory: GetNodePadding2.ɵfac
  });
};
GetNodePadding = __decorate([FExecutionRegister(GetNodePaddingRequest)], GetNodePadding);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GetNodePadding, [{
    type: Injectable
  }], null, null);
})();
var FitToChildNodesAndGroups = class FitToChildNodesAndGroups2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  get _nodes() {
    return this._store.nodes.getAll();
  }
  handle({
    nodeOrGroup
  }) {
    if (nodeOrGroup.fAutoSizeToFitChildren()) {
      const directChildren = this._calculateDirectChildren(nodeOrGroup);
      if (directChildren.length) {
        const currentBounding = this._boundingRect(nodeOrGroup);
        const childrenBounding = this._calculateChildrenBounding(directChildren, this._paddings(nodeOrGroup, currentBounding));
        nodeOrGroup.updatePosition(childrenBounding);
        nodeOrGroup.updateSize(childrenBounding);
        nodeOrGroup.redraw();
      }
    }
    const parent = nodeOrGroup.fParentId();
    if (!parent) {
      return;
    }
    const parentNode = this._nodes.find((x) => x.fId() === parent);
    if (!parentNode) {
      return;
    }
    this._mediator.execute(new FitToChildNodesAndGroupsRequest(parentNode));
  }
  _calculateDirectChildren(nodeOrGroup) {
    return this._nodes.filter((x) => x.fParentId() === nodeOrGroup.fId());
  }
  _unionRect(nodeOrGroups) {
    return RectExtensions.union(nodeOrGroups.map((x) => this._boundingRect(x))) || RectExtensions.initialize();
  }
  _boundingRect(nodeOrGroup) {
    return this._mediator.execute(new GetNormalizedElementRectRequest(nodeOrGroup.hostElement));
  }
  _paddings(nodeOrGroup, rect) {
    return this._mediator.execute(new GetNodePaddingRequest(nodeOrGroup, rect));
  }
  _calculateChildrenBounding(directChildren, [left, top, right, bottom]) {
    let childrenBounding = this._unionRect(directChildren);
    childrenBounding = RectExtensions.initialize(childrenBounding.x - left, childrenBounding.y - top, childrenBounding.width + left + right, childrenBounding.height + top + bottom);
    return childrenBounding;
  }
  static ɵfac = function FitToChildNodesAndGroups_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || FitToChildNodesAndGroups2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: FitToChildNodesAndGroups2,
    factory: FitToChildNodesAndGroups2.ɵfac
  });
};
FitToChildNodesAndGroups = __decorate([FExecutionRegister(FitToChildNodesAndGroupsRequest)], FitToChildNodesAndGroups);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FitToChildNodesAndGroups, [{
    type: Injectable
  }], null, null);
})();
var GetChildNodeIdsRequest = class {
  id;
  static fToken = Symbol("GetChildNodeIdsRequest");
  constructor(id) {
    this.id = id;
  }
};
var GetChildNodeIds = class GetChildNodeIds2 {
  _store = inject(FComponentsStore);
  get _allNodesAndGroups() {
    return this._store.nodes.getAll();
  }
  handle(request) {
    if (!request.id) {
      return [];
    }
    const visited = /* @__PURE__ */ new Set();
    const result = [];
    this._collectDescendants(request.id, result, visited);
    return result;
  }
  _collectDescendants(nodeId, result, visited) {
    if (visited.has(nodeId)) {
      throw new Error(`Circular reference detected in the node hierarchy. Node id: ${nodeId}`);
    }
    visited.add(nodeId);
    const children = this._allNodesAndGroups.filter((n) => n.fParentId() === nodeId).map((x) => x.fId());
    result.push(...children);
    for (const id of children) {
      this._collectDescendants(id, result, visited);
    }
  }
  static ɵfac = function GetChildNodeIds_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || GetChildNodeIds2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: GetChildNodeIds2,
    factory: GetChildNodeIds2.ɵfac
  });
};
GetChildNodeIds = __decorate([FExecutionRegister(GetChildNodeIdsRequest)], GetChildNodeIds);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GetChildNodeIds, [{
    type: Injectable
  }], null, null);
})();
var GetParentNodesRequest = class {
  nodeOrGroup;
  static fToken = Symbol("GetParentNodesRequest");
  constructor(nodeOrGroup) {
    this.nodeOrGroup = nodeOrGroup;
  }
};
var GetParentNodes = class GetParentNodes2 {
  _store = inject(FComponentsStore);
  handle({
    nodeOrGroup
  }) {
    return this._getParentNodes(nodeOrGroup, /* @__PURE__ */ new Set(), []);
  }
  _getParentNodes(nodeOrGroup, visited, result) {
    if (visited.has(nodeOrGroup.fId())) {
      throw new Error("Circular reference detected in the node hierarchy. Node id: " + nodeOrGroup.fId());
    }
    visited.add(nodeOrGroup.fId());
    const parent = this._store.nodes.get(nodeOrGroup.fParentId());
    if (!parent) {
      return result;
    }
    result.push(parent);
    return this._getParentNodes(parent, visited, result);
  }
  static ɵfac = function GetParentNodes_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || GetParentNodes2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: GetParentNodes2,
    factory: GetParentNodes2.ɵfac
  });
};
GetParentNodes = __decorate([FExecutionRegister(GetParentNodesRequest)], GetParentNodes);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GetParentNodes, [{
    type: Injectable
  }], null, null);
})();
var UpdateNodeWhenStateOrSizeChangedRequest = class {
  nodeOrGroup;
  destroyRef;
  static fToken = Symbol("UpdateNodeWhenStateOrSizeChangedRequest");
  constructor(nodeOrGroup, destroyRef) {
    this.nodeOrGroup = nodeOrGroup;
    this.destroyRef = destroyRef;
  }
};
var UpdateNodeWhenStateOrSizeChanged = class UpdateNodeWhenStateOrSizeChanged2 {
  _mediator = inject(FMediator);
  _reflowOrchestrator = inject(FReflowOrchestrator);
  /**
   * Handles the request to update the node's connectors based on state or size changes.
   * It listens for resize events and recalculates the connectable sides of the connectors.
   * @param request
   */
  handle({
    nodeOrGroup,
    destroyRef
  }) {
    const {
      hostElement,
      stateChanges
    } = nodeOrGroup;
    new FChannelHub(new FResizeChannel(hostElement), stateChanges).listen(destroyRef, () => {
      this._mediator.execute(new EmitConnectionsChangesRequest());
      if (!this._isDragging()) {
        this._mediator.execute(new InvalidateFCacheNodeRequest(nodeOrGroup.fId(), "UpdateNodeWhenStateOrSizeChanged"));
        this._mediator.execute(new CalculateConnectorsConnectableSidesRequest(nodeOrGroup));
        this._mediator.execute(new FitToChildNodesAndGroupsRequest(nodeOrGroup));
        this._reflowOrchestrator.handleResize(nodeOrGroup);
      }
    });
  }
  _isDragging() {
    return this._mediator.execute(new IsDragStartedRequest());
  }
  static ɵfac = function UpdateNodeWhenStateOrSizeChanged_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || UpdateNodeWhenStateOrSizeChanged2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: UpdateNodeWhenStateOrSizeChanged2,
    factory: UpdateNodeWhenStateOrSizeChanged2.ɵfac
  });
};
UpdateNodeWhenStateOrSizeChanged = __decorate([FExecutionRegister(UpdateNodeWhenStateOrSizeChangedRequest)], UpdateNodeWhenStateOrSizeChanged);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UpdateNodeWhenStateOrSizeChanged, [{
    type: Injectable
  }], null, null);
})();
var RemoveNodeFromStoreRequest = class {
  instance;
  static fToken = Symbol("RemoveNodeFromStoreRequest");
  constructor(instance) {
    this.instance = instance;
  }
};
var RemoveNodeFromStore = class RemoveNodeFromStore2 {
  _store = inject(FComponentsStore);
  _mediator = inject(FMediator);
  handle({
    instance
  }) {
    this._store.nodes.remove(instance);
    this._mediator.execute(new UnregisterFCacheNodeRequest(instance.fId()));
    this._store.emitNodeChanges();
  }
  static ɵfac = function RemoveNodeFromStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RemoveNodeFromStore2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RemoveNodeFromStore2,
    factory: RemoveNodeFromStore2.ɵfac
  });
};
RemoveNodeFromStore = __decorate([FExecutionRegister(RemoveNodeFromStoreRequest)], RemoveNodeFromStore);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RemoveNodeFromStore, [{
    type: Injectable
  }], null, null);
})();
var F_NODE_FEATURES = [AddNodeToStore, CalculateConnectableSideByConnectedPositions, CalculateConnectableSideByInternalPosition, CalculateInputConnections, CalculateConnectorsConnectableSides, CalculateNodesBoundingBox, CalculateNodesBoundingBoxNormalizedPosition, CalculateOutputConnections, FitToChildNodesAndGroups, GetChildNodeIds, GetNodePadding, GetParentNodes, UpdateNodeWhenStateOrSizeChanged, RemoveNodeFromStore];
var CalculateTargetConnectorsToConnect = class CalculateTargetConnectorsToConnect2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  get _targets() {
    return this._store.inputs.getAll();
  }
  handle({
    source,
    pointer
  }) {
    const targets = this._getConnectableTargets(source);
    const refs = [];
    for (const input2 of targets) {
      refs.push(this._mediator.execute(new GetConnectorRectReferenceRequest(input2)));
    }
    this._scheduleApplyCalculatedSides(refs, pointer);
    return refs;
  }
  _getConnectableTargets(source) {
    if (source.hasConnectionLimits) {
      return this._targets.filter((x) => source.canConnectTo(x));
    }
    let targets = this._targets.filter((x) => x.canBeConnected);
    if (!source.isSelfConnectable) {
      targets = targets.filter((x) => x.fNodeId !== source.fNodeId);
    }
    return targets;
  }
  _scheduleApplyCalculatedSides(refs, pointer) {
    queueMicrotask(() => this._applyCalculatedConnectableSides(refs, pointer));
  }
  _applyCalculatedConnectableSides(refs, pointer) {
    for (const {
      connector
    } of refs) {
      if (!isCalculateMode(connector.userFConnectableSide)) continue;
      connector.fConnectableSide = this._calculateByConnectedPositions(connector, pointer);
    }
  }
  /** Delegates to the connected-positions calculation execution. */
  _calculateByConnectedPositions(connector, pointer) {
    return this._mediator.execute(new CalculateConnectableSideByConnectedPositionsRequest(connector, pointer));
  }
  static ɵfac = function CalculateTargetConnectorsToConnect_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CalculateTargetConnectorsToConnect2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CalculateTargetConnectorsToConnect2,
    factory: CalculateTargetConnectorsToConnect2.ɵfac
  });
};
CalculateTargetConnectorsToConnect = __decorate([FExecutionRegister(CalculateTargetConnectorsToConnectRequest)], CalculateTargetConnectorsToConnect);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalculateTargetConnectorsToConnect, [{
    type: Injectable
  }], null, null);
})();
var CalculateSourceConnectorsToConnectRequest = class {
  target;
  pointer;
  static fToken = Symbol("CalculateSourceConnectorsToConnectRequest");
  constructor(target, pointer) {
    this.target = target;
    this.pointer = pointer;
  }
};
var CalculateSourceConnectorsToConnect = class CalculateSourceConnectorsToConnect2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  get _sources() {
    return this._store.outputs.getAll();
  }
  handle({
    target,
    pointer
  }) {
    const sources = this._getConnectableSources(target);
    const refs = [];
    for (const connector of sources) {
      refs.push(this._mediator.execute(new GetConnectorRectReferenceRequest(connector)));
    }
    this._scheduleApplyCalculatedSides(refs, pointer);
    return refs;
  }
  _getConnectableSources(target) {
    return this._sources.filter((x) => {
      let result = x.canBeConnected;
      if (result && x.hasConnectionLimits) {
        result = x.canConnectTo(target);
      }
      return result;
    });
  }
  _scheduleApplyCalculatedSides(refs, pointer) {
    queueMicrotask(() => this._applyCalculatedConnectableSides(refs, pointer));
  }
  _applyCalculatedConnectableSides(refs, pointer) {
    for (const {
      connector
    } of refs) {
      if (!isCalculateMode(connector.userFConnectableSide)) continue;
      connector.fConnectableSide = this._calculateByConnectedPositions(connector, pointer);
    }
  }
  /** Delegates to the connected-positions calculation execution. */
  _calculateByConnectedPositions(connector, pointer) {
    return this._mediator.execute(new CalculateConnectableSideByConnectedPositionsRequest(connector, pointer));
  }
  static ɵfac = function CalculateSourceConnectorsToConnect_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CalculateSourceConnectorsToConnect2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CalculateSourceConnectorsToConnect2,
    factory: CalculateSourceConnectorsToConnect2.ɵfac
  });
};
CalculateSourceConnectorsToConnect = __decorate([FExecutionRegister(CalculateSourceConnectorsToConnectRequest)], CalculateSourceConnectorsToConnect);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalculateSourceConnectorsToConnect, [{
    type: Injectable
  }], null, null);
})();
var MarkConnectableConnectorsRequest = class {
  connectors;
  static fToken = Symbol("MarkConnectableConnectorsRequest");
  constructor(connectors) {
    this.connectors = connectors;
  }
};
var F_CSS_CLASS = {
  DRAG_AND_DROP: {
    DRAGGING: "f-dragging",
    CONNECTIONS_DRAGGING: "f-connections-dragging"
  },
  GROUPING: {
    OVER_BOUNDARY: "f-grouping-over-boundary",
    DROP_ACTIVE: "f-grouping-drop-active"
  },
  CONNECTOR: {
    OUTPUT_CONNECTED: "f-node-output-connected",
    OUTPUT_NOT_CONNECTABLE: "f-node-output-not-connectable",
    INPUT_CONNECTED: "f-node-input-connected",
    INPUT_NOT_CONNECTABLE: "f-node-input-not-connectable",
    CONNECTABLE: "f-connector-connectable"
  }
};
var MarkConnectableConnectors = class MarkConnectableConnectors2 {
  _store = inject(FComponentsStore);
  handle({
    connectors
  }) {
    this._store.flowHost.classList.add(F_CSS_CLASS.DRAG_AND_DROP.CONNECTIONS_DRAGGING);
    connectors.forEach((x) => this._markConnector(x));
  }
  _markConnector({
    hostElement
  }) {
    hostElement.classList.add(F_CSS_CLASS.CONNECTOR.CONNECTABLE);
  }
  static ɵfac = function MarkConnectableConnectors_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || MarkConnectableConnectors2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: MarkConnectableConnectors2,
    factory: MarkConnectableConnectors2.ɵfac
  });
};
MarkConnectableConnectors = __decorate([FExecutionRegister(MarkConnectableConnectorsRequest)], MarkConnectableConnectors);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MarkConnectableConnectors, [{
    type: Injectable
  }], null, null);
})();
var RemoveConnectorFromStoreRequest = class {
  instance;
  static fToken = Symbol("RemoveConnectorFromStoreRequest");
  constructor(instance) {
    this.instance = instance;
  }
};
var RemoveConnectorFromStore = class RemoveConnectorFromStore2 {
  _store = inject(FComponentsStore);
  _mediator = inject(FMediator);
  handle({
    instance
  }) {
    switch (instance.kind) {
      case "input":
        this._removeInput(instance);
        break;
      case "output":
        this._removeOutput(instance);
        break;
      case "outlet":
        this._removeOutlet(instance);
        break;
      default:
        throw new Error(`Unknown connector kind: ${instance.kind}`);
    }
  }
  _removeInput(component) {
    this._store.inputs.removeById(component.fId());
    this._store.emitNodeChanges();
    this._geometryUnregister(component);
  }
  _removeOutput(component) {
    this._store.outputs.removeById(component.fId());
    this._store.emitNodeChanges();
    this._geometryUnregister(component);
  }
  _removeOutlet(component) {
    this._store.outlets.removeById(component.fId());
    this._store.emitNodeChanges();
    this._geometryUnregister(component);
  }
  _geometryUnregister(component) {
    this._mediator.execute(new UnregisterFCacheConnectorRequest(component.fId(), component.kind));
  }
  static ɵfac = function RemoveConnectorFromStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RemoveConnectorFromStore2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RemoveConnectorFromStore2,
    factory: RemoveConnectorFromStore2.ɵfac
  });
};
RemoveConnectorFromStore = __decorate([FExecutionRegister(RemoveConnectorFromStoreRequest)], RemoveConnectorFromStore);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RemoveConnectorFromStore, [{
    type: Injectable
  }], null, null);
})();
var UnmarkConnectableConnectorsRequest = class {
  connectors;
  static fToken = Symbol("UnmarkConnectableConnectorsRequest");
  constructor(connectors) {
    this.connectors = connectors;
  }
};
var UnmarkConnectableConnectors = class UnmarkConnectableConnectors2 {
  _store = inject(FComponentsStore);
  handle({
    connectors
  }) {
    this._store.flowHost.classList.remove(F_CSS_CLASS.DRAG_AND_DROP.CONNECTIONS_DRAGGING);
    connectors.forEach((x) => this._unmarkConnector(x));
  }
  _unmarkConnector({
    hostElement
  }) {
    hostElement.classList.remove(F_CSS_CLASS.CONNECTOR.CONNECTABLE);
  }
  static ɵfac = function UnmarkConnectableConnectors_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || UnmarkConnectableConnectors2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: UnmarkConnectableConnectors2,
    factory: UnmarkConnectableConnectors2.ɵfac
  });
};
UnmarkConnectableConnectors = __decorate([FExecutionRegister(UnmarkConnectableConnectorsRequest)], UnmarkConnectableConnectors);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UnmarkConnectableConnectors, [{
    type: Injectable
  }], null, null);
})();
var F_CONNECTORS_FEATURES = [AddConnectorToStore, RemoveConnectorFromStore, CalculateClosestConnector, FindConnectableConnectorUsingPriorityAndPosition, CalculateSourceConnectorsToConnect, CalculateTargetConnectorsToConnect, GetConnectorRectReference, MarkConnectableConnectors, UnmarkConnectableConnectors];
var AddFlowToStoreRequest = class {
  instance;
  static fToken = Symbol("AddFlowToStoreRequest");
  constructor(instance) {
    this.instance = instance;
  }
};
var EFLayoutDirection;
(function(EFLayoutDirection2) {
  EFLayoutDirection2["TOP_BOTTOM"] = "TOP_BOTTOM";
  EFLayoutDirection2["BOTTOM_TOP"] = "BOTTOM_TOP";
  EFLayoutDirection2["LEFT_RIGHT"] = "LEFT_RIGHT";
  EFLayoutDirection2["RIGHT_LEFT"] = "RIGHT_LEFT";
})(EFLayoutDirection || (EFLayoutDirection = {}));
var EFLayoutMode;
(function(EFLayoutMode2) {
  EFLayoutMode2["MANUAL"] = "manual";
  EFLayoutMode2["AUTO"] = "auto";
})(EFLayoutMode || (EFLayoutMode = {}));
function normalizeFlowLayoutData(state) {
  const nodes = [...state.nodes.map(mapNode), ...state.groups.map(mapNode)];
  const nodeIds = new Set(state.nodes.map((node) => node.id));
  const groupIds = new Set(state.groups.map((group) => group.id));
  const outputNodeIds = /* @__PURE__ */ new Map();
  const inputNodeIds = /* @__PURE__ */ new Map();
  for (const item of [...state.nodes, ...state.groups]) {
    for (const output2 of item.fOutputs) {
      outputNodeIds.set(output2.id, item.id);
    }
    for (const input2 of item.fInputs) {
      inputNodeIds.set(input2.id, item.id);
    }
  }
  const connections = state.connections.reduce((result, connection) => {
    const sourceNodeId = outputNodeIds.get(connection.fOutputId);
    const targetNodeId = inputNodeIds.get(connection.fInputId);
    if (!sourceNodeId || !targetNodeId) {
      return result;
    }
    result.push({
      source: sourceNodeId,
      target: targetNodeId
    });
    return result;
  }, []);
  return {
    nodes,
    connections,
    nodeIds,
    groupIds
  };
}
function mapNode(node) {
  return {
    id: node.id,
    size: node.measuredSize ? __spreadValues({}, node.measuredSize) : node.size ? __spreadValues({}, node.size) : void 0
  };
}
var FLOW_LAYOUT_DEBOUNCE_MS = 1;
var FLayoutController = class _FLayoutController {
  _destroyRef = inject(DestroyRef);
  _flows = /* @__PURE__ */ new Map();
  _engine;
  constructor() {
    this._destroyRef.onDestroy(() => {
      Array.from(this._flows.keys()).forEach((flowId) => this.unregisterFlow(flowId));
      this._engine = void 0;
    });
  }
  attachEngine(engine) {
    this._engine = engine;
  }
  registerFlow(flow, store) {
    const flowId = flow.fId();
    this.unregisterFlow(flowId);
    const registration = {
      flow,
      store,
      nodeSignature: this._buildNodeSignature(store),
      connectionSignature: this._buildConnectionSignature(store),
      timeoutId: null,
      raf1: null,
      raf2: null,
      unsubs: [],
      runId: 0,
      isApplying: false
    };
    registration.unsubs.push(store.nodesChanges$.listen(() => this._handleNodesChanges(flowId)), store.connectionsChanges$.listen(() => this._handleConnectionsChanges(flowId)));
    this._flows.set(flowId, registration);
    if (this._engine?.getMode() === EFLayoutMode.AUTO) {
      this._scheduleRelayout(flowId);
    }
  }
  unregisterFlow(flowId) {
    const registration = this._flows.get(flowId);
    if (!registration) {
      return;
    }
    registration.unsubs.forEach((unsub) => unsub());
    this._clearScheduledWork(registration);
    this._flows.delete(flowId);
  }
  handleModeChanged(mode) {
    if (mode !== EFLayoutMode.AUTO) {
      return;
    }
    for (const flowId of this._flows.keys()) {
      this._scheduleRelayout(flowId);
    }
  }
  relayout(flowId) {
    return __async(this, null, function* () {
      if (!this._engine) {
        return;
      }
      if (flowId) {
        const registration = this._flows.get(flowId);
        if (registration) {
          yield this._relayoutRegisteredFlow(flowId, registration);
        }
        return;
      }
      for (const [id, registration] of this._flows.entries()) {
        yield this._relayoutRegisteredFlow(id, registration);
      }
    });
  }
  _handleNodesChanges(flowId) {
    const registration = this._flows.get(flowId);
    if (!registration || registration.isApplying) {
      return;
    }
    const nextSignature = this._buildNodeSignature(registration.store);
    if (nextSignature === registration.nodeSignature) {
      return;
    }
    registration.nodeSignature = nextSignature;
    this._scheduleRelayout(flowId);
  }
  _handleConnectionsChanges(flowId) {
    const registration = this._flows.get(flowId);
    if (!registration || registration.isApplying) {
      return;
    }
    const nextSignature = this._buildConnectionSignature(registration.store);
    if (nextSignature === registration.connectionSignature) {
      return;
    }
    registration.connectionSignature = nextSignature;
    this._scheduleRelayout(flowId);
  }
  _scheduleRelayout(flowId) {
    const registration = this._flows.get(flowId);
    if (!registration || !this._engine || this._engine.getMode() !== EFLayoutMode.AUTO) {
      return;
    }
    if (registration.timeoutId !== null) {
      clearTimeout(registration.timeoutId);
    }
    this._cancelAnimationFrames(registration);
    registration.timeoutId = setTimeout(() => {
      registration.timeoutId = null;
      this._runAfterNextPaint(registration, () => void this._relayoutFlowIfReady(flowId));
    }, FLOW_LAYOUT_DEBOUNCE_MS);
  }
  _relayoutFlowIfReady(flowId) {
    return __async(this, null, function* () {
      const registration = this._flows.get(flowId);
      if (!registration || !this._engine || this._engine.getMode() !== EFLayoutMode.AUTO) {
        return;
      }
      if (registration.store.hasPendingProgressiveRender) {
        this._scheduleRelayout(flowId);
        return;
      }
      yield this._relayoutRegisteredFlow(flowId, registration);
    });
  }
  _relayoutRegisteredFlow(flowId, registration) {
    return __async(this, null, function* () {
      if (!this._engine) {
        return;
      }
      const graph = normalizeFlowLayoutData(registration.flow.getState({
        measuredSize: true
      }));
      const runId = ++registration.runId;
      const result = yield this._engine.calculate(graph.nodes, graph.connections, {
        flowId,
        mode: this._engine.getMode()
      });
      const nextRegistration = this._flows.get(flowId);
      if (!nextRegistration || nextRegistration.runId !== runId) {
        return;
      }
      const changedNodes = this._applyPositions(nextRegistration.store, result.nodes);
      if (!changedNodes.length) {
        return;
      }
      nextRegistration.isApplying = true;
      try {
        nextRegistration.flow.redraw();
        this._emitWriteback(flowId, result.nodes, graph.nodeIds, graph.groupIds);
      } finally {
        queueMicrotask(() => {
          const current = this._flows.get(flowId);
          if (current) {
            current.isApplying = false;
          }
        });
      }
    });
  }
  _emitWriteback(flowId, nodes, nodeIds, groupIds) {
    const handler = this._engine?.getWriteback();
    if (!handler) {
      return;
    }
    handler({
      flowId,
      nodes: nodes.filter((node) => nodeIds.has(node.id)),
      groups: nodes.filter((node) => groupIds.has(node.id))
    });
  }
  _applyPositions(store, nodes) {
    return nodes.filter((node) => {
      const registeredNode = store.nodes.get(node.id);
      if (!registeredNode || PointExtensions.isEqual(registeredNode._position, node.position)) {
        return false;
      }
      registeredNode.position.set(__spreadValues({}, node.position));
      return true;
    });
  }
  _buildNodeSignature(store) {
    return store.nodes.getAll().map((node) => node.fId()).sort().join("|");
  }
  _buildConnectionSignature(store) {
    return store.connections.getAll().map((connection) => `${connection.fId()}:${connection.fOutputId()}:${connection.fInputId()}`).sort().join("|");
  }
  _runAfterNextPaint(registration, callback) {
    this._cancelAnimationFrames(registration);
    if (typeof requestAnimationFrame !== "function") {
      callback();
      return;
    }
    registration.raf1 = requestAnimationFrame(() => {
      registration.raf1 = null;
      registration.raf2 = requestAnimationFrame(() => {
        registration.raf2 = null;
        callback();
      });
    });
  }
  _clearScheduledWork(registration) {
    if (registration.timeoutId !== null) {
      clearTimeout(registration.timeoutId);
      registration.timeoutId = null;
    }
    this._cancelAnimationFrames(registration);
  }
  _cancelAnimationFrames(registration) {
    if (registration.raf1 !== null && typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(registration.raf1);
      registration.raf1 = null;
    }
    if (registration.raf2 !== null && typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(registration.raf2);
      registration.raf2 = null;
    }
  }
  static ɵfac = function FLayoutController_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FLayoutController)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _FLayoutController,
    factory: _FLayoutController.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FLayoutController, [{
    type: Injectable
  }], () => [], null);
})();
var F_LAYOUT_OPTIONS = new InjectionToken("F_LAYOUT_OPTIONS");
function mergeLayoutNodes(nodes, positions) {
  return nodes.reduce((result, node) => {
    const position = positions.get(node.id);
    if (!position) {
      return result;
    }
    result.push({
      id: node.id,
      position
    });
    return result;
  }, []);
}
var F_LAYOUT = new InjectionToken("F_LAYOUT");
var FLayoutEngine = class {
  _controller = inject(FLayoutController);
  _config = inject(F_LAYOUT_OPTIONS, {
    optional: true
  }) ?? {};
  _interactiveOptions;
  _mode;
  _writeback;
  _defaultOptions;
  interactiveOptions;
  constructor(defaultOptions) {
    this._mode = this._config.mode ?? EFLayoutMode.MANUAL;
    this._writeback = this._config.writeback ?? null;
    this._defaultOptions = this.mergeOptions(defaultOptions, this._config.options);
    this._interactiveOptions = signal(this.mergeOptions(this._defaultOptions, {}), ...ngDevMode ? [{
      debugName: "_interactiveOptions"
    }] : []);
    this.interactiveOptions = computed(() => this.mergeOptions(this._interactiveOptions(), {}));
    this._controller.attachEngine(this);
  }
  setMode(mode) {
    this._mode = mode;
    this._controller.handleModeChanged(mode);
  }
  getMode() {
    return this._mode;
  }
  setWriteback(handler) {
    this._writeback = handler;
  }
  getWriteback() {
    return this._writeback;
  }
  setInteractiveOptions(options) {
    this._interactiveOptions.set(this.mergeOptions(this._interactiveOptions(), options));
  }
  relayout(flowId) {
    return this._controller.relayout(flowId);
  }
  getProviderConfig() {
    return __spreadValues({}, this._config);
  }
  resolveLayoutOptions(options) {
    const layoutOptions = __spreadValues({}, options ?? {});
    delete layoutOptions.flowId;
    delete layoutOptions.mode;
    return this.mergeOptions(this._interactiveOptions(), layoutOptions);
  }
};
function provideFLayout(engineType, config) {
  return [FLayoutController, engineType, {
    provide: F_LAYOUT,
    useExisting: engineType
  }, {
    provide: F_LAYOUT_OPTIONS,
    useValue: config ?? {}
  }];
}
var AddFlowToStore = class AddFlowToStore2 {
  _store = inject(FComponentsStore);
  _layoutController = inject(FLayoutController, {
    optional: true
  });
  handle({
    instance
  }) {
    this._store.fFlow = instance;
    this._layoutController?.registerFlow(instance, this._store);
  }
  static ɵfac = function AddFlowToStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || AddFlowToStore2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: AddFlowToStore2,
    factory: AddFlowToStore2.ɵfac
  });
};
AddFlowToStore = __decorate([FExecutionRegister(AddFlowToStoreRequest)], AddFlowToStore);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AddFlowToStore, [{
    type: Injectable
  }], null, null);
})();
var GetFlowRequest = class {
  static fToken = Symbol("GetFlowRequest");
};
var GetFlow = class GetFlow2 {
  _store = inject(FComponentsStore);
  handle(_) {
    const result = this._store.fFlow;
    if (!result) {
      throw new Error(`Flow not found in store`);
    }
    return result;
  }
  static ɵfac = function GetFlow_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || GetFlow2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: GetFlow2,
    factory: GetFlow2.ɵfac
  });
};
GetFlow = __decorate([FExecutionRegister(GetFlowRequest)], GetFlow);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GetFlow, [{
    type: Injectable
  }], null, null);
})();
var CalculateConnectionsStateRequest = class {
  static fToken = Symbol("CalculateConnectionsStateRequest");
};
var CalculateConnectionsState = class CalculateConnectionsState2 {
  _store = inject(FComponentsStore);
  handle(_request) {
    return this._store.connections.getAll().map(this._mapToConnectionState);
  }
  _mapToConnectionState(x) {
    return {
      id: x.fId(),
      fOutputId: x.fOutputId(),
      fInputId: x.fInputId(),
      fType: x.fType,
      fBehavior: x.fBehavior,
      isSelected: x.isSelected(),
      waypoints: x.fWaypoints()?.waypoints() || [],
      fInputSide: x.fInputSide(),
      fOutputSide: x.fOutputSide()
    };
  }
  static ɵfac = function CalculateConnectionsState_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CalculateConnectionsState2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CalculateConnectionsState2,
    factory: CalculateConnectionsState2.ɵfac
  });
};
CalculateConnectionsState = __decorate([FExecutionRegister(CalculateConnectionsStateRequest)], CalculateConnectionsState);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalculateConnectionsState, [{
    type: Injectable
  }], null, null);
})();
var CalculateNodesStateRequest = class {
  component;
  measuredSize;
  static fToken = Symbol("CalculateNodesStateRequest");
  constructor(component, measuredSize = false) {
    this.component = component;
    this.measuredSize = measuredSize;
  }
};
var CalculateNodesState = class CalculateNodesState2 {
  _store = inject(FComponentsStore);
  _mediator = inject(FMediator);
  handle({
    component,
    measuredSize
  }) {
    return this._store.nodes.getAll().filter((x) => x instanceof component).map((x) => {
      const measuredRect = measuredSize ? this._mediator.execute(new GetNormalizedElementRectRequest(x.hostElement)) : null;
      return {
        id: x.fId(),
        parentId: x.fParentId() ?? void 0,
        position: __spreadValues({}, x._position),
        size: x._size ? __spreadValues({}, x._size) : void 0,
        measuredSize: measuredRect ? {
          width: measuredRect.width,
          height: measuredRect.height
        } : void 0,
        rotate: x._rotate,
        fOutputs: this._getOutputs(x.hostElement),
        fInputs: this._getInputs(x.hostElement),
        isSelected: x.isSelected()
      };
    });
  }
  _getOutputs(hostElement) {
    return this._store.outputs.getAll().filter((x) => hostElement.contains(x.hostElement)).map((x) => {
      return {
        id: x.fId(),
        fConnectableSide: x.fConnectableSide
      };
    });
  }
  _getInputs(hostElement) {
    return this._store.inputs.getAll().filter((x) => hostElement.contains(x.hostElement)).map((x) => {
      return {
        id: x.fId(),
        fConnectableSide: x.fConnectableSide
      };
    });
  }
  static ɵfac = function CalculateNodesState_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CalculateNodesState2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CalculateNodesState2,
    factory: CalculateNodesState2.ɵfac
  });
};
CalculateNodesState = __decorate([FExecutionRegister(CalculateNodesStateRequest)], CalculateNodesState);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalculateNodesState, [{
    type: Injectable
  }], null, null);
})();
var CalculateFlowStateRequest = class {
  measuredSize;
  static fToken = Symbol("CalculateFlowStateRequest");
  constructor(measuredSize = false) {
    this.measuredSize = measuredSize;
  }
};
var CalculateFlowState = class CalculateFlowState2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  get _canvas() {
    return this._store.fCanvas;
  }
  get _transform() {
    return this._canvas.transform;
  }
  get _canvasPosition() {
    return PointExtensions.sum(this._transform.position, this._transform.scaledPosition);
  }
  handle({
    measuredSize
  }) {
    return {
      position: this._canvasPosition,
      scale: this._canvas.transform.scale,
      nodes: this._mediator.execute(new CalculateNodesStateRequest(FNodeDirective, measuredSize)),
      groups: this._mediator.execute(new CalculateNodesStateRequest(FGroupDirective, measuredSize)),
      connections: this._mediator.execute(new CalculateConnectionsStateRequest())
    };
  }
  static ɵfac = function CalculateFlowState_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CalculateFlowState2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CalculateFlowState2,
    factory: CalculateFlowState2.ɵfac
  });
};
CalculateFlowState = __decorate([FExecutionRegister(CalculateFlowStateRequest)], CalculateFlowState);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalculateFlowState, [{
    type: Injectable
  }], null, null);
})();
var GET_FLOW_STATE_PROVIDERS = [CalculateFlowState, CalculateNodesState, CalculateConnectionsState];
var RemoveFlowFromStoreRequest = class {
  instance;
  static fToken = Symbol("RemoveFlowFromStoreRequest");
  constructor(instance) {
    this.instance = instance;
  }
};
var RemoveFlowFromStore = class RemoveFlowFromStore2 {
  _store = inject(FComponentsStore);
  _layoutController = inject(FLayoutController, {
    optional: true
  });
  handle({
    instance
  }) {
    this._layoutController?.unregisterFlow(instance.fId());
    this._store.fFlow = void 0;
  }
  static ɵfac = function RemoveFlowFromStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RemoveFlowFromStore2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: RemoveFlowFromStore2,
    factory: RemoveFlowFromStore2.ɵfac
  });
};
RemoveFlowFromStore = __decorate([FExecutionRegister(RemoveFlowFromStoreRequest)], RemoveFlowFromStore);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RemoveFlowFromStore, [{
    type: Injectable
  }], null, null);
})();
var RenderLifecycleState = class _RenderLifecycleState {
  isNodesRendered = false;
  isFullRendered = false;
  static ɵfac = function RenderLifecycleState_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RenderLifecycleState)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _RenderLifecycleState,
    factory: _RenderLifecycleState.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RenderLifecycleState, [{
    type: Injectable
  }], null, null);
})();
var NotifyNodesRenderedRequest = class {
  static fToken = Symbol("NotifyNodesRenderedRequest");
};
var F_FLOW = new InjectionToken("F_FLOW");
var FFlowBase = class {
};
var NotifyNodesRendered = class NotifyNodesRendered2 {
  _state = inject(RenderLifecycleState);
  _fFlow = inject(F_FLOW);
  handle(_) {
    if (this._state.isNodesRendered) {
      return;
    }
    this._state.isNodesRendered = true;
    this._fFlow.fNodesRendered.emit(this._fFlow.fId());
  }
  static ɵfac = function NotifyNodesRendered_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NotifyNodesRendered2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: NotifyNodesRendered2,
    factory: NotifyNodesRendered2.ɵfac
  });
};
NotifyNodesRendered = __decorate([FExecutionRegister(NotifyNodesRenderedRequest)], NotifyNodesRendered);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotifyNodesRendered, [{
    type: Injectable
  }], null, null);
})();
var NotifyFullRenderedRequest = class {
  static fToken = Symbol("NotifyFullRenderedRequest");
};
var NotifyFullRendered = class NotifyFullRendered2 {
  _state = inject(RenderLifecycleState);
  _fFlow = inject(F_FLOW);
  handle(_) {
    if (this._state.isFullRendered) {
      return;
    }
    this._state.isFullRendered = true;
    this._fFlow.fFullRendered.emit(this._fFlow.fId());
    this._fFlow.fLoaded.emit(this._fFlow.fId());
  }
  static ɵfac = function NotifyFullRendered_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NotifyFullRendered2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: NotifyFullRendered2,
    factory: NotifyFullRendered2.ɵfac
  });
};
NotifyFullRendered = __decorate([FExecutionRegister(NotifyFullRenderedRequest)], NotifyFullRendered);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotifyFullRendered, [{
    type: Injectable
  }], null, null);
})();
var WaitForConnectionsRenderedRequest = class {
  targetConnectionsRevision;
  targetNodesRevision;
  callback;
  destroyRef;
  static fToken = Symbol("WaitForConnectionsRenderedRequest");
  constructor(targetConnectionsRevision, targetNodesRevision, callback, destroyRef) {
    this.targetConnectionsRevision = targetConnectionsRevision;
    this.targetNodesRevision = targetNodesRevision;
    this.callback = callback;
    this.destroyRef = destroyRef;
  }
};
var WaitForConnectionsRendered = class WaitForConnectionsRendered2 {
  _store = inject(FComponentsStore);
  handle({
    targetConnectionsRevision,
    targetNodesRevision,
    callback,
    destroyRef
  }) {
    if (this._store.connectionsRenderedRevision >= targetConnectionsRevision && this._store.connectionsRenderedNodesRevision >= targetNodesRevision) {
      callback();
      return;
    }
    const stop = this._store.connectionsRenderedChanges$.listen(() => {
      if (this._store.connectionsRenderedRevision < targetConnectionsRevision || this._store.connectionsRenderedNodesRevision < targetNodesRevision) {
        return;
      }
      stop();
      callback();
    });
    destroyRef.onDestroy(stop);
  }
  static ɵfac = function WaitForConnectionsRendered_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || WaitForConnectionsRendered2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: WaitForConnectionsRendered2,
    factory: WaitForConnectionsRendered2.ɵfac
  });
};
WaitForConnectionsRendered = __decorate([FExecutionRegister(WaitForConnectionsRenderedRequest)], WaitForConnectionsRendered);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WaitForConnectionsRendered, [{
    type: Injectable
  }], null, null);
})();
var ResetRenderLifecycleRequest = class {
  static fToken = Symbol("ResetRenderLifecycleRequest");
};
var ResetRenderLifecycle = class ResetRenderLifecycle2 {
  _state = inject(RenderLifecycleState);
  handle(_) {
    this._state.isNodesRendered = false;
    this._state.isFullRendered = false;
  }
  static ɵfac = function ResetRenderLifecycle_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ResetRenderLifecycle2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ResetRenderLifecycle2,
    factory: ResetRenderLifecycle2.ɵfac
  });
};
ResetRenderLifecycle = __decorate([FExecutionRegister(ResetRenderLifecycleRequest)], ResetRenderLifecycle);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResetRenderLifecycle, [{
    type: Injectable
  }], null, null);
})();
var QueueConnectionRedrawRequest = class {
  destroyRef;
  static fToken = Symbol("QueueConnectionRedrawRequest");
  constructor(destroyRef) {
    this.destroyRef = destroyRef;
  }
};
var QueueConnectionRedrawState = class _QueueConnectionRedrawState {
  isWaitingForViewportAnimation = false;
  pendingRedraw = false;
  static ɵfac = function QueueConnectionRedrawState_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _QueueConnectionRedrawState)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _QueueConnectionRedrawState,
    factory: _QueueConnectionRedrawState.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(QueueConnectionRedrawState, [{
    type: Injectable
  }], null, null);
})();
var QueueConnectionRedraw = class QueueConnectionRedraw2 {
  _state = inject(QueueConnectionRedrawState);
  _store = inject(FComponentsStore);
  _mediator = inject(FMediator);
  handle(request) {
    this._state.pendingRedraw = true;
    if (this._state.isWaitingForViewportAnimation) {
      return;
    }
    this._state.isWaitingForViewportAnimation = true;
    const stop = this._store.viewportAnimationChanges$.listen(() => {
      if (this._store.isViewportAnimating) {
        return;
      }
      const shouldRedraw = this._state.pendingRedraw;
      stop();
      this._state.isWaitingForViewportAnimation = false;
      this._state.pendingRedraw = false;
      if (!shouldRedraw) {
        return;
      }
      this._mediator.execute(new RedrawConnectionsRequest());
    });
    request.destroyRef.onDestroy(stop);
  }
  static ɵfac = function QueueConnectionRedraw_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || QueueConnectionRedraw2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: QueueConnectionRedraw2,
    factory: QueueConnectionRedraw2.ɵfac
  });
};
QueueConnectionRedraw = __decorate([FExecutionRegister(QueueConnectionRedrawRequest)], QueueConnectionRedraw);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(QueueConnectionRedraw, [{
    type: Injectable
  }], null, null);
})();
var F_FLOW_FEATURES = [AddFlowToStore, GetFlow, ...GET_FLOW_STATE_PROVIDERS, RemoveFlowFromStore, RenderLifecycleState, NotifyNodesRendered, NotifyFullRendered, WaitForConnectionsRendered, ResetRenderLifecycle, QueueConnectionRedrawState, QueueConnectionRedraw];
var ClearSelectionRequest = class {
  static fToken = Symbol("ClearSelectionRequest");
};
var ClearSelection = class ClearSelection2 {
  _dragContext = inject(FDraggableDataContext);
  handle(_) {
    this._dragContext.selectedItems.forEach((x) => x.unmarkAsSelected());
    this._dragContext.selectedItems = [];
    this._dragContext.isSelectedChanged = true;
  }
  static ɵfac = function ClearSelection_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ClearSelection2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ClearSelection2,
    factory: ClearSelection2.ɵfac
  });
};
ClearSelection = __decorate([FExecutionRegister(ClearSelectionRequest)], ClearSelection);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ClearSelection, [{
    type: Injectable
  }], null, null);
})();
var CalculateSelectableItemsRequest = class {
  static fToken = Symbol("CalculateSelectableItemsRequest");
};
var CalculateSelectableItems = class CalculateSelectableItems2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  _dragContext = inject(FDraggableDataContext);
  get _nodes() {
    return this._store.nodes.getAll();
  }
  get _connections() {
    return this._store.connections.getAll();
  }
  handle() {
    return [...this._nodeRects(), ...this._connectionRects()].filter((x) => {
      return !this._dragContext.selectedItems.includes(x.element);
    });
  }
  /**
   * Retrieves nodes with their bounding rectangles that can be selected.
   * @private
   */
  _nodeRects() {
    return this._nodes.filter((x) => !x.fSelectionDisabled()).map((x) => {
      return {
        element: x,
        fRect: this._mediator.execute(new GetNormalizedElementRectRequest(x.hostElement))
      };
    });
  }
  /**
   * Retrieves connections with their bounding rectangles that can be selected.
   * @private
   */
  _connectionRects() {
    return this._connections.filter((x) => !x.fSelectionDisabled()).map((x) => {
      return {
        element: x,
        fRect: this._mediator.execute(new GetNormalizedElementRectRequest(x.boundingElement))
      };
    });
  }
  static ɵfac = function CalculateSelectableItems_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CalculateSelectableItems2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: CalculateSelectableItems2,
    factory: CalculateSelectableItems2.ɵfac
  });
};
CalculateSelectableItems = __decorate([FExecutionRegister(CalculateSelectableItemsRequest)], CalculateSelectableItems);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalculateSelectableItems, [{
    type: Injectable
  }], null, null);
})();
var GetCurrentSelectionRequest = class {
  static fToken = Symbol("GetCurrentSelectionRequest");
};
var GetCurrentSelection = class GetCurrentSelection2 {
  _dragContext = inject(FDraggableDataContext);
  handle() {
    return {
      fNodeIds: this._getSelectedNodes(),
      fGroupIds: this._getSelectedGroups(),
      fConnectionIds: this._getSelectedConnections()
    };
  }
  _getSelectedNodes() {
    return this._dragContext.selectedItems.filter((x) => x.hostElement.classList.contains("f-node")).map((x) => x.hostElement.dataset["fNodeId"]);
  }
  _getSelectedGroups() {
    return this._dragContext.selectedItems.filter((x) => x.hostElement.classList.contains("f-group")).map((x) => x.hostElement.dataset["fGroupId"]);
  }
  _getSelectedConnections() {
    return this._dragContext.selectedItems.filter((x) => !x.hostElement.classList.contains("f-node") && !x.hostElement.classList.contains("f-group")).map((x) => x.hostElement.id);
  }
  static ɵfac = function GetCurrentSelection_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || GetCurrentSelection2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: GetCurrentSelection2,
    factory: GetCurrentSelection2.ɵfac
  });
};
GetCurrentSelection = __decorate([FExecutionRegister(GetCurrentSelectionRequest)], GetCurrentSelection);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GetCurrentSelection, [{
    type: Injectable
  }], null, null);
})();
var SelectRequest = class {
  nodes;
  connections;
  isSelectedChanged;
  static fToken = Symbol("SelectRequest");
  constructor(nodes, connections, isSelectedChanged = true) {
    this.nodes = nodes;
    this.connections = connections;
    this.isSelectedChanged = isSelectedChanged;
  }
};
var Select = class Select2 {
  _dragContext = inject(FDraggableDataContext);
  _store = inject(FComponentsStore);
  handle(request) {
    this._dragContext.selectedItems.forEach((x) => {
      x.unmarkAsSelected();
    });
    this._dragContext.selectedItems = [];
    request.nodes.forEach((key) => {
      const node = this._store.nodes.get(key);
      if (node) {
        node.markAsSelected();
        this._dragContext.selectedItems.push(node);
      }
    });
    request.connections.forEach((key) => {
      const connection = this._store.connections.get(key);
      if (connection) {
        connection.markAsSelected();
        this._dragContext.selectedItems.push(connection);
      }
    });
    this._dragContext.isSelectedChanged = request.isSelectedChanged;
  }
  static ɵfac = function Select_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || Select2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: Select2,
    factory: Select2.ɵfac
  });
};
Select = __decorate([FExecutionRegister(SelectRequest)], Select);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Select, [{
    type: Injectable
  }], null, null);
})();
var SelectAllRequest = class {
  static fToken = Symbol("SelectAllRequest");
};
var SelectAll = class SelectAll2 {
  _dragSession = inject(FDraggableDataContext);
  _store = inject(FComponentsStore);
  handle(_request) {
    this._dragSession.selectedItems.forEach((x) => {
      x.unmarkAsSelected();
    });
    this._dragSession.selectedItems = [];
    this._store.nodes.getAll().forEach((x) => {
      x.markAsSelected();
      this._dragSession.selectedItems.push(x);
    });
    this._store.connections.getAll().forEach((x) => {
      x.markAsSelected();
      this._dragSession.selectedItems.push(x);
    });
    this._dragSession.isSelectedChanged = true;
  }
  static ɵfac = function SelectAll_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SelectAll2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: SelectAll2,
    factory: SelectAll2.ɵfac
  });
};
SelectAll = __decorate([FExecutionRegister(SelectAllRequest)], SelectAll);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SelectAll, [{
    type: Injectable
  }], null, null);
})();
var SelectAndUpdateNodeLayerRequest = class {
  nodeOrGroup;
  static fToken = Symbol("SelectAndUpdateNodeLayerRequest");
  constructor(nodeOrGroup) {
    this.nodeOrGroup = nodeOrGroup;
  }
};
var MoveFrontElementsBeforeTargetElementRequest = class {
  fItemsContainer;
  allElements;
  elementsThatShouldBeInFront;
  targetIndex;
  static fToken = Symbol("MoveFrontElementsBeforeTargetElementRequest");
  constructor(fItemsContainer, allElements, elementsThatShouldBeInFront, targetIndex) {
    this.fItemsContainer = fItemsContainer;
    this.allElements = allElements;
    this.elementsThatShouldBeInFront = elementsThatShouldBeInFront;
    this.targetIndex = targetIndex;
  }
};
var MoveFrontElementsBeforeTargetElement = class MoveFrontElementsBeforeTargetElement2 {
  handle(request) {
    const elementsToMove = [];
    for (let i = request.targetIndex + 1; i < request.allElements.length; i++) {
      const element = request.allElements[i];
      if (!request.elementsThatShouldBeInFront.includes(element)) {
        elementsToMove.push(element);
      }
    }
    elementsToMove.forEach((x) => {
      request.fItemsContainer.removeChild(x);
      request.fItemsContainer.insertBefore(x, request.allElements[request.targetIndex]);
    });
  }
  static ɵfac = function MoveFrontElementsBeforeTargetElement_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || MoveFrontElementsBeforeTargetElement2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: MoveFrontElementsBeforeTargetElement2,
    factory: MoveFrontElementsBeforeTargetElement2.ɵfac
  });
};
MoveFrontElementsBeforeTargetElement = __decorate([FExecutionRegister(MoveFrontElementsBeforeTargetElementRequest)], MoveFrontElementsBeforeTargetElement);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MoveFrontElementsBeforeTargetElement, [{
    type: Injectable
  }], null, null);
})();
var UpdateItemAndChildrenLayersRequest = class {
  item;
  itemContainer;
  static fToken = Symbol("UpdateItemAndChildrenLayersRequest");
  constructor(item, itemContainer) {
    this.item = item;
    this.itemContainer = itemContainer;
  }
};
var GetDeepChildrenNodesAndGroupsRequest = class {
  nodeOrGroupId;
  static fToken = Symbol("GetDeepChildrenNodesAndGroupsRequest");
  constructor(nodeOrGroupId) {
    this.nodeOrGroupId = nodeOrGroupId;
  }
};
var GetDeepChildrenNodesAndGroups = class GetDeepChildrenNodesAndGroups2 {
  _store = inject(FComponentsStore);
  handle({
    nodeOrGroupId
  }) {
    return this._getChildrenNodes(nodeOrGroupId);
  }
  _getChildrenNodes(nodeOrGroupId, visited = /* @__PURE__ */ new Set()) {
    if (visited.has(nodeOrGroupId)) {
      throw new Error("Circular reference detected in the node hierarchy. Node id: " + nodeOrGroupId);
    }
    visited.add(nodeOrGroupId);
    const directChildren = this._store.nodes.getAll().filter((x) => x.fParentId() === nodeOrGroupId);
    return directChildren.reduce((result, x) => {
      return result.concat(this._getChildrenNodes(x.fId(), visited));
    }, directChildren);
  }
  static ɵfac = function GetDeepChildrenNodesAndGroups_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || GetDeepChildrenNodesAndGroups2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: GetDeepChildrenNodesAndGroups2,
    factory: GetDeepChildrenNodesAndGroups2.ɵfac
  });
};
GetDeepChildrenNodesAndGroups = __decorate([FExecutionRegister(GetDeepChildrenNodesAndGroupsRequest)], GetDeepChildrenNodesAndGroups);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GetDeepChildrenNodesAndGroups, [{
    type: Injectable
  }], null, null);
})();
var UpdateItemAndChildrenLayers = class UpdateItemAndChildrenLayers2 {
  _store = inject(FComponentsStore);
  _mediator = inject(FMediator);
  get _canvas() {
    return this._store.fCanvas;
  }
  get _groupsContainer() {
    return this._canvas.fGroupsContainer().nativeElement;
  }
  get _nodesContainer() {
    return this._canvas.fNodesContainer().nativeElement;
  }
  get _connectionsContainer() {
    return this._canvas.fConnectionsContainer().nativeElement;
  }
  handle(request) {
    switch (request.itemContainer) {
      case this._groupsContainer:
        this._handleGroup(request);
        break;
      case this._nodesContainer:
        this._handleNode(request);
        break;
      case this._connectionsContainer:
        this._handleConnection(request);
        break;
      default:
        throw new Error("Unknown container");
    }
  }
  _handleGroup(request) {
    const childrenNodesAndGroups = this._getChildrenNodesAndGroups(request.item.fId());
    const childrenGroups = this._getChildrenGroups(childrenNodesAndGroups);
    this._updateLayers(this._groupsContainer, request.item.hostElement, childrenGroups);
    const childrenNodes = this._getChildrenNodes(childrenNodesAndGroups);
    if (childrenNodes.length) {
      this._updateLayers(this._nodesContainer, childrenNodes[0], childrenNodes);
    }
  }
  _handleNode(request) {
    const childrenNodesAndGroups = this._getChildrenNodesAndGroups(request.item.fId());
    const childrenNodes = this._getChildrenNodes(childrenNodesAndGroups);
    this._updateLayers(request.itemContainer, request.item.hostElement, childrenNodes);
  }
  _handleConnection(request) {
    this._updateLayers(request.itemContainer, request.item.hostElement, []);
  }
  _updateLayers(itemContainer, item, elementsThatShouldBeInFront) {
    const allElements = Array.from(itemContainer.children);
    const targetIndex = allElements.findIndex((x) => x === item);
    if (this._isAnythingNeedToBeMoved(allElements, targetIndex, elementsThatShouldBeInFront)) {
      this._mediator.execute(new MoveFrontElementsBeforeTargetElementRequest(itemContainer, allElements, elementsThatShouldBeInFront, targetIndex));
    }
  }
  _isAnythingNeedToBeMoved(allElements, targetIndex, elementsThatShouldBeInFront) {
    for (let i = targetIndex + 1; i < allElements.length; i++) {
      if (!elementsThatShouldBeInFront.includes(allElements[i])) {
        return true;
      }
    }
    return false;
  }
  _getChildrenGroups(elements) {
    const allElements = Array.from(this._groupsContainer.children);
    return elements.filter((x) => this._groupsContainer.contains(x)).sort((a, b) => allElements.indexOf(a) - allElements.indexOf(b));
  }
  _getChildrenNodes(elements) {
    const allElements = Array.from(this._nodesContainer.children);
    return elements.filter((x) => this._nodesContainer.contains(x)).sort((a, b) => allElements.indexOf(a) - allElements.indexOf(b));
  }
  _getChildrenNodesAndGroups(fId) {
    return this._mediator.execute(new GetDeepChildrenNodesAndGroupsRequest(fId)).map((x) => x.hostElement);
  }
  static ɵfac = function UpdateItemAndChildrenLayers_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || UpdateItemAndChildrenLayers2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: UpdateItemAndChildrenLayers2,
    factory: UpdateItemAndChildrenLayers2.ɵfac
  });
};
UpdateItemAndChildrenLayers = __decorate([FExecutionRegister(UpdateItemAndChildrenLayersRequest)], UpdateItemAndChildrenLayers);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UpdateItemAndChildrenLayers, [{
    type: Injectable
  }], null, null);
})();
var SelectAndUpdateNodeLayer = class SelectAndUpdateNodeLayer2 {
  _dragSession = inject(FDraggableDataContext);
  _mediator = inject(FMediator);
  handle({
    nodeOrGroup
  }) {
    this._selectNodeIfNotSelected(nodeOrGroup);
    this._mediator.execute(new UpdateItemAndChildrenLayersRequest(nodeOrGroup, nodeOrGroup.hostElement.parentElement));
  }
  _selectNodeIfNotSelected(node) {
    if (node.fSelectionDisabled()) {
      return;
    }
    if (this._dragSession.selectedItems.includes(node)) {
      return;
    }
    this._dragSession.selectedItems.push(node);
    node.markAsSelected();
    this._dragSession.isSelectedChanged = true;
  }
  static ɵfac = function SelectAndUpdateNodeLayer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SelectAndUpdateNodeLayer2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: SelectAndUpdateNodeLayer2,
    factory: SelectAndUpdateNodeLayer2.ɵfac
  });
};
SelectAndUpdateNodeLayer = __decorate([FExecutionRegister(SelectAndUpdateNodeLayerRequest)], SelectAndUpdateNodeLayer);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SelectAndUpdateNodeLayer, [{
    type: Injectable
  }], null, null);
})();
var F_SELECTION_FEATURES = [ClearSelection, CalculateSelectableItems, GetCurrentSelection, Select, SelectAll, SelectAndUpdateNodeLayer];
var ResetZoomRequest = class {
  static fToken = Symbol("ResetZoomRequest");
};
var ResetZoom = class ResetZoom2 {
  _store = inject(FComponentsStore);
  get _canvas() {
    return this._store.fCanvas;
  }
  handle(_request) {
    this._canvas.resetScale();
    this._canvas.redraw();
    this._canvas.emitCanvasChangeEvent();
  }
  static ɵfac = function ResetZoom_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ResetZoom2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: ResetZoom2,
    factory: ResetZoom2.ɵfac
  });
};
ResetZoom = __decorate([FExecutionRegister(ResetZoomRequest)], ResetZoom);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResetZoom, [{
    type: Injectable
  }], null, null);
})();
var SetZoomRequest = class {
  position;
  step;
  direction;
  animate;
  static fToken = Symbol("SetZoomRequest");
  constructor(position, step, direction, animate = false) {
    this.position = position;
    this.step = step;
    this.direction = direction;
    this.animate = animate;
  }
};
var DRAG_KINDS_WITH_REBASE = /* @__PURE__ */ new Set(["drag-node", "drag-external-item", "resize-node", "rotate-node", "create-connection", "reassign-connection", "drag-connection-waypoint", "assign-to-container"]);
var DRAG_KINDS_WITHOUT_REBASE = /* @__PURE__ */ new Set(["drag-canvas", "selection-area"]);
var SetZoom = class SetZoom2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  _dragContext = inject(FDraggableDataContext, {
    optional: true
  });
  get _flowHost() {
    return this._store.flowHost;
  }
  get _canvas() {
    return this._store.fCanvas;
  }
  get _zoomComponent() {
    return this._store.instances.get(INSTANCES.ZOOM);
  }
  get _isDragStarted() {
    return this._mediator.execute(new IsDragStartedRequest());
  }
  handle(request) {
    if (!this._zoomComponent) {
      return;
    }
    const currentScale = this._canvas.transform.scale;
    const nextScale = this._clamp(currentScale + request.step * request.direction);
    if (nextScale === currentScale) {
      return;
    }
    const positionInFlowHost = this._castPositionToFlow(request.position);
    if (this._isDragStarted) {
      const mode = this._getDragZoomMode();
      if (mode === "blocked") {
        return;
      }
      if (mode === "rebase") {
        this._rebaseDragContext(positionInFlowHost, nextScale);
      }
    }
    this._canvas.setScale(nextScale, positionInFlowHost);
    request.animate ? this._canvas.redrawWithAnimation() : this._canvas.redraw();
    this._canvas.emitCanvasChangeEvent();
  }
  _clamp(value) {
    return Math.max(this._zoomComponent?.minimum || 1, Math.min(value, this._zoomComponent?.maximum || 1));
  }
  _castPositionToFlow(position) {
    return Point.fromPoint(position).elementTransform(this._flowHost);
  }
  _getDragZoomMode() {
    if (this._dragContext?.isEmpty()) {
      return "blocked";
    }
    let shouldRebase = false;
    for (const handler of this._dragContext?.draggableItems ?? []) {
      const kind = handler.getEvent().kind;
      if (DRAG_KINDS_WITH_REBASE.has(kind)) {
        shouldRebase = true;
        continue;
      }
      if (DRAG_KINDS_WITHOUT_REBASE.has(kind)) {
        continue;
      }
      return "blocked";
    }
    return shouldRebase ? "rebase" : "direct";
  }
  _rebaseDragContext(positionInFlowHost, nextScale) {
    if (!this._dragContext) {
      return;
    }
    const pointerDownScale = this._dragContext.onPointerDownScale;
    if (!pointerDownScale || pointerDownScale === nextScale) {
      this._dragContext.onPointerDownScale = nextScale;
      return;
    }
    const scaleDelta = 1 / nextScale - 1 / pointerDownScale;
    this._dragContext.onPointerDownPosition = Point.fromPoint(this._dragContext.onPointerDownPosition).add(Point.fromPoint(positionInFlowHost).mult(scaleDelta));
    this._dragContext.onPointerDownScale = nextScale;
  }
  static ɵfac = function SetZoom_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SetZoom2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: SetZoom2,
    factory: SetZoom2.ɵfac
  });
};
SetZoom = __decorate([FExecutionRegister(SetZoomRequest)], SetZoom);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SetZoom, [{
    type: Injectable
  }], null, null);
})();
var F_ZOOM_FEATURES = [ResetZoom, SetZoom];
var MinimapDrawNodesRequest = class {
  static fToken = Symbol("MinimapDrawNodesRequest");
};
var MinimapDrawNodes = class MinimapDrawNodes2 {
  _browser = inject(BrowserService);
  _store = inject(FComponentsStore);
  handle(_) {
    const flow = this._store.fFlow;
    const canvas = this._store.fCanvas;
    if (!flow || !canvas) {
      return [];
    }
    const nodes = this._store.nodes.getAll();
    return nodes.map((node) => this._renderNode(node, flow, canvas));
  }
  _renderNode(node, flow, canvas) {
    const rect = createSVGElement("rect", this._browser);
    setRectToElement(this._nodeRect(node, flow, canvas), rect);
    const isNode2 = node instanceof FNodeDirective;
    rect.classList.add("f-component", isNode2 ? "f-minimap-node" : "f-minimap-group");
    rect.classList.add(...this._minimapClasses(node));
    if (node.isSelected()) {
      rect.classList.add("f-selected");
    }
    return rect;
  }
  _nodeRect(node, flow, canvas) {
    const inFlow = RectExtensions.elementTransform(RectExtensions.fromElement(node.hostElement), flow.hostElement);
    return RectExtensions.div(inFlow, canvas.transform.scale);
  }
  _minimapClasses(node) {
    const classes = node.fMinimapClass();
    return Array.isArray(classes) ? classes : [classes];
  }
  static ɵfac = function MinimapDrawNodes_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || MinimapDrawNodes2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: MinimapDrawNodes2,
    factory: MinimapDrawNodes2.ɵfac
  });
};
MinimapDrawNodes = __decorate([FExecutionRegister(MinimapDrawNodesRequest)], MinimapDrawNodes);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MinimapDrawNodes, [{
    type: Injectable
  }], null, null);
})();
var MinimapCalculateViewportRequest = class {
  svg;
  minSize;
  static fToken = Symbol("MinimapCalculateViewportRequest");
  constructor(svg, minSize) {
    this.svg = svg;
    this.minSize = minSize;
  }
};
var MinimapCalculateViewport = class MinimapCalculateViewport2 {
  _mediator = inject(FMediator);
  _store = inject(FComponentsStore);
  handle({
    svg,
    minSize
  }) {
    const flow = this._store.fFlow;
    const canvas = this._store.fCanvas;
    if (!flow || !canvas) {
      return {
        scale: 1,
        viewBox: RectExtensions.initialize(0, 0, 0, 0)
      };
    }
    const contentRect = this._contentRectInMinimapSpace(flow, canvas, minSize);
    const minimapRect = this._minimapRectInFlowSpace(svg, flow);
    const scale = this._viewportScale(contentRect, minimapRect);
    const viewBox = this._viewportViewBox(contentRect, minimapRect, scale);
    return {
      scale,
      viewBox
    };
  }
  _contentRectInMinimapSpace(flow, canvas, minSize) {
    const global = this._nodesBoundingBox();
    const inFlow = RectExtensions.elementTransform(global, flow.hostElement);
    const inMinimap = RectExtensions.div(inFlow, canvas.transform.scale);
    return adjustRectToMinSize(inMinimap, minSize);
  }
  _nodesBoundingBox() {
    return this._mediator.execute(new CalculateNodesBoundingBoxRequest()) ?? RectExtensions.initialize(0, 0, 0, 0);
  }
  _minimapRectInFlowSpace(svg, flow) {
    return RectExtensions.elementTransform(RectExtensions.fromElement(svg), flow.hostElement);
  }
  _viewportScale(contentRect, minimapRect) {
    const mw = minimapRect.width || 1;
    const mh = minimapRect.height || 1;
    return Math.max(contentRect.width / mw, contentRect.height / mh);
  }
  _viewportViewBox(contentRect, minimapRect, scale) {
    const viewSize = this._viewportSize(minimapRect, scale);
    const x = contentRect.x - (viewSize.width - contentRect.width) / 2;
    const y = contentRect.y - (viewSize.height - contentRect.height) / 2;
    return RectExtensions.initialize(x, y, viewSize.width, viewSize.height);
  }
  _viewportSize(minimapRect, scale) {
    return SizeExtensions.initialize(minimapRect.width * scale || 0, minimapRect.height * scale || 0);
  }
  static ɵfac = function MinimapCalculateViewport_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || MinimapCalculateViewport2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: MinimapCalculateViewport2,
    factory: MinimapCalculateViewport2.ɵfac
  });
};
MinimapCalculateViewport = __decorate([FExecutionRegister(MinimapCalculateViewportRequest)], MinimapCalculateViewport);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MinimapCalculateViewport, [{
    type: Injectable
  }], null, null);
})();
var MinimapCalculateViewRectRequest = class {
  static fToken = Symbol("MinimapCalculateViewRectRequest");
};
var MinimapCalculateViewRect = class MinimapCalculateViewRect2 {
  _store = inject(FComponentsStore);
  handle(_request) {
    const flow = this._store.fFlow;
    const canvas = this._store.fCanvas;
    if (!flow || !canvas) {
      return RectExtensions.initialize();
    }
    const rect = RectExtensions.div(RectExtensions.fromElement(flow.hostElement), canvas.transform.scale);
    rect.x = 0;
    rect.y = 0;
    return rect;
  }
  static ɵfac = function MinimapCalculateViewRect_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || MinimapCalculateViewRect2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: MinimapCalculateViewRect2,
    factory: MinimapCalculateViewRect2.ɵfac
  });
};
MinimapCalculateViewRect = __decorate([FExecutionRegister(MinimapCalculateViewRectRequest)], MinimapCalculateViewRect);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MinimapCalculateViewRect, [{
    type: Injectable
  }], null, null);
})();
var FMinimapState = class {
  element;
  scale;
  viewBox;
  constructor(element, scale = 1, viewBox = RectExtensions.initialize(0, 0, 0, 0)) {
    this.element = element;
    this.scale = scale;
    this.viewBox = viewBox;
  }
};
var F_MINIMAP_FEATURES = [MinimapDrawNodes, MinimapCalculateViewport, MinimapCalculateViewRect];
var GetNormalizedPointRequest = class {
  position;
  static fToken = Symbol("GetNormalizedPointRequest");
  constructor(position) {
    this.position = position;
  }
};
var GetNormalizedPoint = class GetNormalizedPoint2 {
  _store = inject(FComponentsStore);
  handle({
    position
  }) {
    return calculatePointerInFlow(position, this._store.flowHost, this._store.transform);
  }
  static ɵfac = function GetNormalizedPoint_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || GetNormalizedPoint2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: GetNormalizedPoint2,
    factory: GetNormalizedPoint2.ɵfac
  });
};
GetNormalizedPoint = __decorate([FExecutionRegister(GetNormalizedPointRequest)], GetNormalizedPoint);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GetNormalizedPoint, [{
    type: Injectable
  }], null, null);
})();
var SortNodeLayersRequest = class {
  static fToken = Symbol("SortNodeLayersRequest");
};
var SortNodeLayers = class SortNodeLayers2 {
  _store = inject(FComponentsStore);
  _mediator = inject(FMediator);
  _browser = inject(BrowserService);
  get _canvas() {
    return this._store.fCanvas;
  }
  get _groupsContainer() {
    return this._canvas.fGroupsContainer().nativeElement;
  }
  get _nodesContainer() {
    return this._canvas.fNodesContainer().nativeElement;
  }
  get _fNodeElements() {
    return Array.from(this._nodesContainer.children);
  }
  handle(_) {
    this._getGroups().forEach((parent) => {
      this._moveChildrenNodes(this._getSortedChildrenNodes(parent));
    });
  }
  _getGroups() {
    return this._store.nodes.getAll().filter((x) => this._groupsContainer.contains(x.hostElement));
  }
  _getSortedChildrenNodes(parent) {
    const allElements = this._fNodeElements;
    return this._getChildrenNodes(parent.fId()).sort((a, b) => allElements.indexOf(a) - allElements.indexOf(b));
  }
  _getChildrenNodes(fId) {
    return this._mediator.execute(new GetDeepChildrenNodesAndGroupsRequest(fId)).filter((x) => this._nodesContainer.contains(x.hostElement)).map((x) => x.hostElement);
  }
  _moveChildrenNodes(sortedChildrenGroups) {
    const fragment = this._browser.document.createDocumentFragment();
    sortedChildrenGroups.forEach((childGroup) => {
      fragment.appendChild(childGroup);
    });
    this._nodesContainer.appendChild(fragment);
  }
  static ɵfac = function SortNodeLayers_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SortNodeLayers2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: SortNodeLayers2,
    factory: SortNodeLayers2.ɵfac
  });
};
SortNodeLayers = __decorate([FExecutionRegister(SortNodeLayersRequest)], SortNodeLayers);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SortNodeLayers, [{
    type: Injectable
  }], null, null);
})();
var SortItemsByParentRequest = class {
  itemsContainer;
  static fToken = Symbol("SortItemsByParentRequest");
  constructor(itemsContainer) {
    this.itemsContainer = itemsContainer;
  }
};
var SortItemsByParent = class SortItemsByParent2 {
  _store = inject(FComponentsStore);
  _browser = inject(BrowserService);
  handle({
    itemsContainer
  }) {
    const elements = Array.from(itemsContainer.children);
    if (elements.length < 2) {
      return;
    }
    const positions = this._buildPositions(elements);
    const items = this._store.nodes.getAll().filter((x) => itemsContainer.contains(x.hostElement));
    if (items.length < 2 || !items.some((item) => !!item.fParentId())) {
      return;
    }
    const childrenByParentId = this._buildChildrenByParentId(items);
    const descendantsCache = /* @__PURE__ */ new Map();
    for (const item of items) {
      const children = this._getSortedChildrenBeforeParent(itemsContainer, positions, item, childrenByParentId, descendantsCache);
      if (!children.length) {
        continue;
      }
      this._moveBeforeNextSibling(itemsContainer, children, item.hostElement.nextElementSibling);
    }
  }
  _buildPositions(elements) {
    const result = /* @__PURE__ */ new Map();
    for (let i = 0; i < elements.length; i++) {
      result.set(elements[i], i);
    }
    return result;
  }
  _getSortedChildrenBeforeParent(container, positions, parent, childrenByParentId, descendantsCache) {
    const parentPos = positions.get(parent.hostElement);
    if (parentPos === void 0) {
      return [];
    }
    const children = this._getDeepChildren(parent.fId(), childrenByParentId, descendantsCache);
    if (!children.length) {
      return [];
    }
    const result = [];
    for (const child of children) {
      const el = child.hostElement;
      if (!container.contains(el)) {
        continue;
      }
      const pos = positions.get(el);
      if (pos === void 0 || pos >= parentPos) {
        continue;
      }
      result.push(el);
    }
    result.sort((a, b) => (positions.get(a) ?? 0) - (positions.get(b) ?? 0));
    return result;
  }
  _buildChildrenByParentId(nodes) {
    const result = /* @__PURE__ */ new Map();
    for (const node of nodes) {
      const parentId = node.fParentId();
      if (!parentId) {
        continue;
      }
      const children = result.get(parentId) ?? [];
      children.push(node);
      result.set(parentId, children);
    }
    return result;
  }
  _getDeepChildren(parentId, childrenByParentId, descendantsCache) {
    const cached = descendantsCache.get(parentId);
    if (cached) {
      return cached;
    }
    const result = [];
    const stack = [...childrenByParentId.get(parentId) ?? []];
    const visited = /* @__PURE__ */ new Set([parentId]);
    while (stack.length) {
      const node = stack.pop();
      if (!node) {
        continue;
      }
      const nodeId = node.fId();
      if (visited.has(nodeId)) {
        continue;
      }
      visited.add(nodeId);
      result.push(node);
      const children = childrenByParentId.get(nodeId);
      if (children?.length) {
        stack.push(...children);
      }
    }
    descendantsCache.set(parentId, result);
    return result;
  }
  _moveBeforeNextSibling(container, items, nextSibling) {
    const fragment = this._browser.document.createDocumentFragment();
    for (const item of items) {
      fragment.appendChild(item);
    }
    container.insertBefore(fragment, nextSibling);
  }
  static ɵfac = function SortItemsByParent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SortItemsByParent2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: SortItemsByParent2,
    factory: SortItemsByParent2.ɵfac
  });
};
SortItemsByParent = __decorate([FExecutionRegister(SortItemsByParentRequest)], SortItemsByParent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SortItemsByParent, [{
    type: Injectable
  }], null, null);
})();
var SortItemLayersRequest = class {
  static fToken = Symbol("SortItemLayersRequest");
};
var SortItemLayers = class SortItemLayers2 {
  _store = inject(FComponentsStore);
  _mediator = inject(FMediator);
  get _canvas() {
    return this._store.fCanvas;
  }
  handle(_request) {
    if (!this._canvas) {
      return;
    }
    const nodes = this._store.nodes.getAll();
    if (nodes.length < 2 || !nodes.some((node) => !!node.fParentId())) {
      return;
    }
    this._mediator.execute(new SortItemsByParentRequest(this._canvas.fGroupsContainer().nativeElement));
    this._mediator.execute(new SortNodeLayersRequest());
    this._mediator.execute(new SortItemsByParentRequest(this._canvas.fNodesContainer().nativeElement));
  }
  static ɵfac = function SortItemLayers_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SortItemLayers2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: SortItemLayers2,
    factory: SortItemLayers2.ɵfac
  });
};
SortItemLayers = __decorate([FExecutionRegister(SortItemLayersRequest)], SortItemLayers);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SortItemLayers, [{
    type: Injectable
  }], null, null);
})();
function createSVGElement(tag, fBrowser) {
  return fBrowser.document.createElementNS("http://www.w3.org/2000/svg", tag);
}
function isValidEventTrigger(event, fTrigger) {
  return fTrigger(event);
}
function defaultEventTrigger(_event) {
  return true;
}
function isMobile() {
  return /android|iPad|iPhone|iPod/i.test(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    navigator.userAgent || navigator.vendor || window["opera"]
  );
}
function Deprecated(newMethodName, removalVersion = "18.0.0") {
  return function(_target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    if (typeof originalMethod !== "function") {
      return descriptor;
    }
    descriptor.value = function(...args) {
      console.warn(`Method "${String(propertyKey)}" is deprecated. Use "${newMethodName}" instead. This method will be removed in version ${removalVersion}.`);
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
function LogExecutionTime(label) {
  const logLabel = (propertyKey) => label || String(propertyKey);
  return function(_target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    if (typeof originalMethod !== "function") {
      return descriptor;
    }
    descriptor.value = function(...args) {
      const startedAt = performance.now();
      const result = originalMethod.apply(this, args);
      if (result instanceof Promise) {
        return result.finally(() => {
          console.warn(`[LogExecutionTime] ${logLabel(propertyKey)} completed in ${Math.round(performance.now() - startedAt)}ms.`);
        });
      }
      console.warn(`[LogExecutionTime] ${logLabel(propertyKey)} completed in ${Math.round(performance.now() - startedAt)}ms.`);
      return result;
    };
    return descriptor;
  };
}
var COMMON_PROVIDERS = [...F_CANVAS_FEATURES, ...F_CONNECTION_FEATURES, ...F_BACKGROUND_FEATURES, ...F_CONNECTORS_FEATURES, ...F_DRAGGABLE_FEATURES, ...F_FLOW_FEATURES, ...F_NODE_FEATURES, ...F_SELECTION_FEATURES, ...F_ZOOM_FEATURES, ...F_MINIMAP_FEATURES, ...F_CACHE_FEATURES, GetDeepChildrenNodesAndGroups, GetNormalizedConnectorRect, GetNormalizedElementRect, GetNormalizedPoint, SortItemLayers, SortItemsByParent, SortNodeLayers, UpdateItemAndChildrenLayers, MoveFrontElementsBeforeTargetElement];
var uniqueId$5 = 0;
var FRectPatternComponent = class _FRectPatternComponent {
  _destroyRef = inject(DestroyRef);
  _elementReference = inject(ElementRef);
  _fBrowser = inject(BrowserService);
  _stateChanges = new FChannel();
  get hostElement() {
    return this._elementReference.nativeElement;
  }
  id = input(`f-pattern-${uniqueId$5++}`, ...ngDevMode ? [{
    debugName: "id"
  }] : []);
  vColor = input("rgba(0,0,0,0.1)", ...ngDevMode ? [{
    debugName: "vColor"
  }] : []);
  hColor = input("rgba(0,0,0,0.1)", ...ngDevMode ? [{
    debugName: "hColor"
  }] : []);
  vSize = input(20, ...ngDevMode ? [{
    debugName: "vSize",
    transform: numberAttribute
  }] : [{
    transform: numberAttribute
  }]);
  hSize = input(20, ...ngDevMode ? [{
    debugName: "hSize",
    transform: numberAttribute
  }] : [{
    transform: numberAttribute
  }]);
  _transform = TransformModelExtensions.default();
  _position = PointExtensions.initialize();
  _size = SizeExtensions.initialize(this.hSize(), this.vSize());
  _pattern;
  _vLine;
  _hLine;
  constructor() {
    this._createPattern();
  }
  _createPattern() {
    this._pattern = createSVGElement("pattern", this._fBrowser);
    this._pattern.setAttribute("patternUnits", "userSpaceOnUse");
    this.hostElement.appendChild(this._pattern);
    this._vLine = createSVGElement("line", this._fBrowser);
    this._pattern.appendChild(this._vLine);
    this._hLine = createSVGElement("line", this._fBrowser);
    this._pattern.appendChild(this._hLine);
  }
  ngOnInit() {
    this._listenStateChanges();
  }
  _listenStateChanges() {
    new FChannelHub(this._stateChanges).pipe(notifyOnStart()).listen(this._destroyRef, () => this._redraw());
  }
  ngOnChanges(changes) {
    if (changes["vSize"] || changes["hSize"] || changes["vColor"] || changes["hColor"]) {
      this._refresh();
    }
  }
  _redraw() {
    this._calculatePattern();
    this._redrawPattern();
    this._redrawLine(this._vLine, this.vColor(), this._size.width, 0, this._size.width, this._size.height);
    this._redrawLine(this._hLine, this.hColor(), 0, this._size.height, this._size.width, this._size.height);
  }
  _calculatePattern() {
    this._position.x = this._transform.position.x + this._transform.scaledPosition.x;
    this._position.y = this._transform.position.y + this._transform.scaledPosition.y;
    this._size = SizeExtensions.initialize(this.hSize() * this._transform.scale, this.vSize() * this._transform.scale);
  }
  _redrawPattern() {
    this._pattern.setAttribute("x", `${this._position.x}`);
    this._pattern.setAttribute("y", `${this._position.y}`);
    this._pattern.setAttribute("width", `${this._size.width}`);
    this._pattern.setAttribute("height", `${this._size.height}`);
  }
  _redrawLine(line, color, x1, y1, x2, y2) {
    line.setAttribute("stroke", `${color}`);
    line.setAttribute("x1", `${x1}`);
    line.setAttribute("x2", `${x2}`);
    line.setAttribute("y1", `${y1}`);
    line.setAttribute("y2", `${y2}`);
  }
  setTransform(transform) {
    this._transform = transform;
    this._refresh();
  }
  _refresh() {
    this._stateChanges.notify();
  }
  static ɵfac = function FRectPatternComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FRectPatternComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _FRectPatternComponent,
    selectors: [["f-rect-pattern"]],
    hostVars: 1,
    hostBindings: function FRectPatternComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("id", ctx.id);
      }
    },
    inputs: {
      id: [1, "id"],
      vColor: [1, "vColor"],
      hColor: [1, "hColor"],
      vSize: [1, "vSize"],
      hSize: [1, "hSize"]
    },
    features: [ɵɵProvidersFeature([{
      provide: F_BACKGROUND_PATTERN,
      useExisting: _FRectPatternComponent
    }]), ɵɵNgOnChangesFeature],
    decls: 0,
    vars: 0,
    template: function FRectPatternComponent_Template(rf, ctx) {
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FRectPatternComponent, [{
    type: Component,
    args: [{
      selector: "f-rect-pattern",
      template: ``,
      standalone: true,
      host: {
        "[attr.id]": "id"
      },
      providers: [{
        provide: F_BACKGROUND_PATTERN,
        useExisting: FRectPatternComponent
      }],
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], () => [], {
    id: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "id",
        required: false
      }]
    }],
    vColor: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "vColor",
        required: false
      }]
    }],
    hColor: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "hColor",
        required: false
      }]
    }],
    vSize: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "vSize",
        required: false
      }]
    }],
    hSize: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "hSize",
        required: false
      }]
    }]
  });
})();
var uniqueId$4 = 0;
var FCirclePatternComponent = class _FCirclePatternComponent {
  _destroyRef = inject(DestroyRef);
  _elementReference = inject(ElementRef);
  _fBrowser = inject(BrowserService);
  _stateChanges = new FChannel();
  get hostElement() {
    return this._elementReference.nativeElement;
  }
  id = input(`f-pattern-${uniqueId$4++}`, ...ngDevMode ? [{
    debugName: "id"
  }] : []);
  color = input("rgba(0,0,0,0.1)", ...ngDevMode ? [{
    debugName: "color"
  }] : []);
  radius = input(20, ...ngDevMode ? [{
    debugName: "radius",
    transform: numberAttribute
  }] : [{
    transform: numberAttribute
  }]);
  _scaledRadius = 20;
  _transform = TransformModelExtensions.default();
  _position = PointExtensions.initialize();
  _pattern;
  _circle;
  constructor() {
    this._createPattern();
  }
  _createPattern() {
    this._pattern = createSVGElement("pattern", this._fBrowser);
    this._pattern.setAttribute("patternUnits", "userSpaceOnUse");
    this.hostElement.appendChild(this._pattern);
    this._circle = createSVGElement("circle", this._fBrowser);
    this._pattern.appendChild(this._circle);
  }
  ngOnInit() {
    this._listenStateChanges();
  }
  _listenStateChanges() {
    new FChannelHub(this._stateChanges).pipe(notifyOnStart()).listen(this._destroyRef, () => this._redraw());
  }
  ngOnChanges(changes) {
    if (changes["radius"] || changes["color"]) {
      this._refresh();
    }
  }
  _redraw() {
    this._calculatePattern();
    this._redrawPattern();
    this._redrawElement();
  }
  _calculatePattern() {
    this._position.x = this._transform.position.x + this._transform.scaledPosition.x;
    this._position.y = this._transform.position.y + this._transform.scaledPosition.y;
    this._scaledRadius = this.radius() * this._transform.scale;
  }
  _redrawPattern() {
    this._pattern.setAttribute("x", `${this._position.x}`);
    this._pattern.setAttribute("y", `${this._position.y}`);
    this._pattern.setAttribute("width", `${this._scaledRadius}`);
    this._pattern.setAttribute("height", `${this._scaledRadius}`);
  }
  _redrawElement() {
    this._circle.setAttribute("fill", this.color());
    this._circle.setAttribute("cx", `${this._scaledRadius / 2}`);
    this._circle.setAttribute("cy", `${this._scaledRadius / 2}`);
    this._circle.setAttribute("r", `${this._scaledRadius / this.radius()}`);
  }
  setTransform(transform) {
    this._transform = transform;
    this._refresh();
  }
  _refresh() {
    this._stateChanges.notify();
  }
  static ɵfac = function FCirclePatternComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FCirclePatternComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _FCirclePatternComponent,
    selectors: [["f-circle-pattern"]],
    hostVars: 1,
    hostBindings: function FCirclePatternComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("id", ctx.id);
      }
    },
    inputs: {
      id: [1, "id"],
      color: [1, "color"],
      radius: [1, "radius"]
    },
    features: [ɵɵProvidersFeature([{
      provide: F_BACKGROUND_PATTERN,
      useExisting: _FCirclePatternComponent
    }]), ɵɵNgOnChangesFeature],
    decls: 0,
    vars: 0,
    template: function FCirclePatternComponent_Template(rf, ctx) {
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FCirclePatternComponent, [{
    type: Component,
    args: [{
      selector: "f-circle-pattern",
      template: ``,
      standalone: true,
      host: {
        "[attr.id]": "id"
      },
      providers: [{
        provide: F_BACKGROUND_PATTERN,
        useExisting: FCirclePatternComponent
      }],
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], () => [], {
    id: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "id",
        required: false
      }]
    }],
    color: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "color",
        required: false
      }]
    }],
    radius: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "radius",
        required: false
      }]
    }]
  });
})();
var F_BACKGROUND = new InjectionToken("F_BACKGROUND");
var FBackgroundBase = class _FBackgroundBase {
  hostElement = inject(ElementRef).nativeElement;
  static ɵfac = function FBackgroundBase_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FBackgroundBase)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FBackgroundBase
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FBackgroundBase, [{
    type: Directive
  }], null, null);
})();
var FBackgroundComponent = class _FBackgroundComponent extends FBackgroundBase {
  _mediator = inject(FMediator);
  fBackgroundPattern = contentChild(F_BACKGROUND_PATTERN, ...ngDevMode ? [{
    debugName: "fBackgroundPattern"
  }] : []);
  ngOnInit() {
    this._mediator.execute(new RegisterPluginInstanceRequest(INSTANCES.BACKGROUND, this));
  }
  ngAfterContentInit() {
    this._mediator.execute(new AddPatternToBackgroundRequest(this.fBackgroundPattern()));
  }
  setTransform(transform) {
    this.fBackgroundPattern()?.setTransform(transform);
  }
  ngOnDestroy() {
    this._mediator.execute(new RemovePluginInstanceRequest(INSTANCES.BACKGROUND));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFBackgroundComponent_BaseFactory;
    return function FBackgroundComponent_Factory(__ngFactoryType__) {
      return (ɵFBackgroundComponent_BaseFactory || (ɵFBackgroundComponent_BaseFactory = ɵɵgetInheritedFactory(_FBackgroundComponent)))(__ngFactoryType__ || _FBackgroundComponent);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _FBackgroundComponent,
    selectors: [["f-background"]],
    contentQueries: function FBackgroundComponent_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuerySignal(dirIndex, ctx.fBackgroundPattern, F_BACKGROUND_PATTERN, 5);
      }
      if (rf & 2) {
        ɵɵqueryAdvance();
      }
    },
    hostAttrs: [1, "f-component", "f-background"],
    features: [ɵɵProvidersFeature([{
      provide: F_BACKGROUND,
      useExisting: _FBackgroundComponent
    }]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c7,
    decls: 2,
    vars: 0,
    template: function FBackgroundComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵnamespaceSVG();
        ɵɵelementStart(0, "svg");
        ɵɵprojection(1);
        ɵɵelementEnd();
      }
    },
    styles: ["[_nghost-%COMP%]{position:absolute;width:100%;height:100%;left:0;top:0;transform-origin:0 0;pointer-events:none}[_nghost-%COMP%]   svg[_ngcontent-%COMP%]{width:100%;height:100%}"],
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FBackgroundComponent, [{
    type: Component,
    args: [{
      selector: "f-background",
      template: "<svg><ng-content></ng-content></svg>",
      standalone: true,
      host: {
        "class": "f-component f-background"
      },
      providers: [{
        provide: F_BACKGROUND,
        useExisting: FBackgroundComponent
      }],
      changeDetection: ChangeDetectionStrategy.OnPush,
      styles: [":host{position:absolute;width:100%;height:100%;left:0;top:0;transform-origin:0 0;pointer-events:none}:host svg{width:100%;height:100%}\n"]
    }]
  }], null, {
    fBackgroundPattern: [{
      type: ContentChild,
      args: [forwardRef(() => F_BACKGROUND_PATTERN), {
        isSignal: true
      }]
    }]
  });
})();
var F_BACKGROUND_PROVIDERS = [FBackgroundComponent, FRectPatternComponent, FCirclePatternComponent];
var FAutoPanBase = class _FAutoPanBase {
  hostElement = inject(ElementRef).nativeElement;
  static ɵfac = function FAutoPanBase_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FAutoPanBase)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FAutoPanBase
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FAutoPanBase, [{
    type: Directive
  }], null, null);
})();
var FAutoPan = class _FAutoPan extends FAutoPanBase {
  _mediator = inject(FMediator);
  fEdgeThreshold = input(20, ...ngDevMode ? [{
    debugName: "fEdgeThreshold",
    transform: (value) => numberAttribute(value, 20)
  }] : [{
    transform: (value) => numberAttribute(value, 20)
  }]);
  fSpeed = input(8, ...ngDevMode ? [{
    debugName: "fSpeed",
    transform: (value) => numberAttribute(value, 8)
  }] : [{
    transform: (value) => numberAttribute(value, 8)
  }]);
  fAcceleration = input(false, ...ngDevMode ? [{
    debugName: "fAcceleration",
    transform: (value) => booleanAttribute(value)
  }] : [{
    transform: (value) => booleanAttribute(value)
  }]);
  ngOnInit() {
    this._mediator.execute(new RegisterPluginInstanceRequest(INSTANCES.AUTO_PAN, this));
  }
  ngOnDestroy() {
    this._mediator.execute(new RemovePluginInstanceRequest(INSTANCES.AUTO_PAN));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFAutoPan_BaseFactory;
    return function FAutoPan_Factory(__ngFactoryType__) {
      return (ɵFAutoPan_BaseFactory || (ɵFAutoPan_BaseFactory = ɵɵgetInheritedFactory(_FAutoPan)))(__ngFactoryType__ || _FAutoPan);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _FAutoPan,
    selectors: [["f-auto-pan"]],
    hostAttrs: [1, "f-auto-pan", "f-component", 2, "display", "none"],
    inputs: {
      fEdgeThreshold: [1, "fEdgeThreshold"],
      fSpeed: [1, "fSpeed"],
      fAcceleration: [1, "fAcceleration"]
    },
    features: [ɵɵInheritDefinitionFeature],
    decls: 0,
    vars: 0,
    template: function FAutoPan_Template(rf, ctx) {
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FAutoPan, [{
    type: Component,
    args: [{
      selector: "f-auto-pan",
      template: ``,
      standalone: true,
      host: {
        class: "f-auto-pan f-component",
        style: "display: none;"
      }
    }]
  }], null, {
    fEdgeThreshold: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fEdgeThreshold",
        required: false
      }]
    }],
    fSpeed: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fSpeed",
        required: false
      }]
    }],
    fAcceleration: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fAcceleration",
        required: false
      }]
    }]
  });
})();
var F_AUTO_PAN_PROVIDERS = [FAutoPan];
var EFCanvasLayer;
(function(EFCanvasLayer2) {
  EFCanvasLayer2["GROUPS"] = "groups";
  EFCanvasLayer2["CONNECTIONS"] = "connections";
  EFCanvasLayer2["NODES"] = "nodes";
})(EFCanvasLayer || (EFCanvasLayer = {}));
var F_DEFAULT_LAYER_ORDER = [EFCanvasLayer.GROUPS, EFCanvasLayer.CONNECTIONS, EFCanvasLayer.NODES];
var F_CANVAS = new InjectionToken("F_CANVAS");
var FCanvasBase = class _FCanvasBase {
  hostElement = inject(ElementRef).nativeElement;
  transform = TransformModelExtensions.default();
  _fCanvasChange = new FChannel();
  destroyRef = inject(DestroyRef);
  getPosition() {
    return this.transform.position;
  }
  _setPosition(position) {
    this.transform.position = position;
  }
  emitCanvasChangeEvent() {
    this._fCanvasChange.notify();
  }
  subscribeOnCanvasChange() {
    new FChannelHub(this._fCanvasChange).pipe(debounceTime(this.debounce())).listen(this.destroyRef, () => {
      this.fCanvasChange.emit(new FCanvasChangeEvent(PointExtensions.sum(this.transform.position, this.transform.scaledPosition), this.transform.scale));
    });
  }
  static ɵfac = function FCanvasBase_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FCanvasBase)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FCanvasBase
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FCanvasBase, [{
    type: Directive
  }], null, null);
})();
var FCanvasChangeEvent = class {
  position;
  scale;
  constructor(position, scale) {
    this.position = position;
    this.scale = scale;
  }
};
function resolveLayerOrder(value) {
  const known = new Set(F_DEFAULT_LAYER_ORDER);
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const layer of value ?? []) {
    if (!known.has(layer) || seen.has(layer)) continue;
    seen.add(layer);
    out.push(layer);
  }
  for (const layer of F_DEFAULT_LAYER_ORDER) {
    if (!seen.has(layer)) out.push(layer);
  }
  return out;
}
var F_CANVAS_CONFIG = new InjectionToken("F_CANVAS_CONFIG");
var DEFAULT_CONFIG = {
  layers: [...F_DEFAULT_LAYER_ORDER]
};
function mergeFCanvasConfig(partial) {
  if (!partial) {
    return {
      layers: [...DEFAULT_CONFIG.layers]
    };
  }
  return {
    layers: partial.layers ? [...partial.layers] : [...DEFAULT_CONFIG.layers]
  };
}
function withFCanvas(config) {
  return {
    kind: EFFlowFeatureKind.CANVAS,
    providers: [{
      provide: F_CANVAS_CONFIG,
      useValue: mergeFCanvasConfig(config)
    }]
  };
}
var FCanvasComponent = class _FCanvasComponent extends FCanvasBase {
  _mediator = inject(FMediator);
  _components = inject(FComponentsStore);
  _injector = inject(Injector);
  _config = inject(F_CANVAS_CONFIG, {
    optional: true
  });
  _flowId;
  fCanvasChange = output();
  position = input(PointExtensions.initialize(), ...ngDevMode ? [{
    debugName: "position",
    transform: PointExtensions.castToPoint
  }] : [{
    transform: PointExtensions.castToPoint
  }]);
  scale = input(1, ...ngDevMode ? [{
    debugName: "scale",
    transform: numberAttribute
  }] : [{
    transform: numberAttribute
  }]);
  debounceTime = input(0, ...ngDevMode ? [{
    debugName: "debounceTime",
    transform: numberAttribute
  }] : [{
    transform: numberAttribute
  }]);
  debounce = computed(() => this.debounceTime() < 0 ? 0 : this.debounceTime(), ...ngDevMode ? [{
    debugName: "debounce"
  }] : []);
  /**
   * Stacking order of the built-in layers (groups, connections, nodes),
   * read bottom to top. The first entry sits underneath, the last entry
   * sits on top. Defaults to the order shipped before v18.6:
   * `[GROUPS, CONNECTIONS, NODES]`.
   *
   * When `withFCanvas({ layers })` is provided in the component's
   * injector, this input falls back to that value; passing `fLayers`
   * directly always wins. Missing layers are appended in their default
   * position so every canvas renders all three regardless of input.
   */
  fLayers = input(void 0, ...ngDevMode ? [{
    debugName: "fLayers"
  }] : []);
  /**
   * Final layer order rendered in the template. The three sibling
   * containers are emitted in this order, which (combined with
   * `isolation: isolate` on each of them) is what visually stacks
   * groups, connections, and nodes — no per-container z-index involved.
   */
  resolvedLayers = computed(() => {
    const fromInput = this.fLayers();
    if (fromInput && fromInput.length > 0) {
      return resolveLayerOrder(fromInput);
    }
    if (this._config?.layers) {
      return resolveLayerOrder(this._config.layers);
    }
    return [...F_DEFAULT_LAYER_ORDER];
  }, ...ngDevMode ? [{
    debugName: "resolvedLayers"
  }] : []);
  fGroupsContainer = viewChild.required("fGroupsContainer");
  fNodesContainer = viewChild.required("fNodesContainer");
  fConnectionsContainer = viewChild.required("fConnectionsContainer");
  get flowId() {
    return this._flowId || "";
  }
  ngOnInit() {
    this._flowId = this._mediator.execute(new GetFlowRequest()).fId();
    this._mediator.execute(new AddCanvasToStoreRequest(this));
    this._positionChange();
    this._scaleChange();
    super.subscribeOnCanvasChange();
  }
  _positionChange() {
    effect(() => {
      const position = this.position();
      untracked(() => {
        this._mediator.execute(new InputCanvasPositionRequest(this.transform, position));
      });
    }, {
      injector: this._injector
    });
  }
  _scaleChange() {
    effect(() => {
      const scale = this.scale();
      untracked(() => {
        this._mediator.execute(new InputCanvasScaleRequest(this.transform, scale));
      });
    }, {
      injector: this._injector
    });
  }
  /**
   * Redraws the canvas by applying the current transformation.
   */
  redraw() {
    this._mediator.execute(new SetBackgroundTransformRequest(this.transform));
    this.hostElement.style.removeProperty("transition");
    this.hostElement.style.transform = TransformModelExtensions.toString(this.transform);
    this._mediator.execute(new NotifyTransformChangedRequest());
  }
  /**
   * Redraws the canvas with an animation effect.
   * This method applies a CSS transition to the canvas element,
   * allowing for a smooth visual update of the canvas's transformation.
   */
  redrawWithAnimation() {
    this._mediator.execute(new SetBackgroundTransformRequest(this.transform));
    this.hostElement.style.transition = `transform ${isMobile() ? 80 : 150}ms ease-in-out`;
    this.hostElement.style.transform = TransformModelExtensions.toString(this.transform);
    transitionEnd(this.hostElement, () => this.redraw());
  }
  /**
   * Centers the specified group or node on the canvas.
   * @param groupOrNodeId - The ID of the group or node to center.
   * @param animated - If true, the centering will be animated; otherwise, it will be instantaneous.
   */
  centerGroupOrNode(groupOrNodeId, animated = true) {
    this._afterRedraw(() => {
      this._mediator.execute(new CenterGroupOrNodeRequest(groupOrNodeId, animated));
    });
  }
  /**
   * Fits the canvas to the screen by adjusting the scale and position.
   * @param padding - paddings from the bounds of the canvas
   * @param animated - If true, the fit will be animated; otherwise, it will be instantaneous.
   */
  fitToScreen(padding = PointExtensions.initialize(), animated = true) {
    this._afterRedraw(() => {
      this._mediator.execute(new FitToFlowRequest(padding, animated));
    });
  }
  /**
   * Resets the scale and center all nodes and groups on the canvas.
   * This method is used to restore the canvas to its default scale and position,
   * allowing users to quickly return to a standard view of the canvas content.
   * @param animated - If true, the reset will be animated; otherwise, it will be instantaneous.
   * This is useful for providing a smooth user experience when resetting the view.
   */
  resetScaleAndCenter(animated = true) {
    this._afterRedraw(() => {
      this._mediator.execute(new ResetScaleAndCenterRequest(animated));
    });
  }
  /**
   *  Gets the current scale of the canvas.
   */
  getScale() {
    return this.transform.scale || 1;
  }
  /**
   * Sets the scale of the canvas to a specified value.
   * This method is used to zoom in or out of the canvas,
   * allowing users to adjust the view of the canvas content.
   * @param scale - The scale factor to set for the canvas.
   * @param toPosition - The position to which the canvas should be centered after scaling.
   */
  setScale(scale, toPosition = PointExtensions.initialize()) {
    this._mediator.execute(new UpdateScaleRequest(scale, toPosition));
  }
  /**
   * Resets the scale of the canvas to its default value.
   * This method is used to restore the canvas to its original scale.
   */
  resetScale() {
    this._mediator.execute(new ResetScaleRequest());
  }
  ngOnDestroy() {
    this._mediator.execute(new RemoveCanvasFromStoreRequest());
  }
  _afterRedraw(callback) {
    this._mediator.execute(new WaitForConnectionsRenderedRequest(this._components.connectionsRevision, this._components.nodesRevision, () => afterNextRender(callback, {
      injector: this._injector
    }), this.destroyRef));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFCanvasComponent_BaseFactory;
    return function FCanvasComponent_Factory(__ngFactoryType__) {
      return (ɵFCanvasComponent_BaseFactory || (ɵFCanvasComponent_BaseFactory = ɵɵgetInheritedFactory(_FCanvasComponent)))(__ngFactoryType__ || _FCanvasComponent);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _FCanvasComponent,
    selectors: [["f-canvas"]],
    viewQuery: function FCanvasComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuerySignal(ctx.fGroupsContainer, _c8, 5);
        ɵɵviewQuerySignal(ctx.fNodesContainer, _c9, 5);
        ɵɵviewQuerySignal(ctx.fConnectionsContainer, _c10, 5);
      }
      if (rf & 2) {
        ɵɵqueryAdvance(3);
      }
    },
    hostAttrs: [1, "f-component", "f-canvas"],
    inputs: {
      position: [1, "position"],
      scale: [1, "scale"],
      debounceTime: [1, "debounceTime"],
      fLayers: [1, "fLayers"]
    },
    outputs: {
      fCanvasChange: "fCanvasChange"
    },
    features: [ɵɵProvidersFeature([{
      provide: F_CANVAS,
      useExisting: _FCanvasComponent
    }]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c12,
    decls: 3,
    vars: 0,
    consts: [["fGroupsContainer", ""], ["fConnectionsContainer", ""], ["fNodesContainer", ""], [1, "f-groups-container"], [1, "f-connections-container"], [1, "f-nodes-container"]],
    template: function FCanvasComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef(_c11);
        ɵɵelementContainerStart(0);
        ɵɵrepeaterCreate(1, FCanvasComponent_For_2_Template, 3, 1, null, null, ɵɵrepeaterTrackByIdentity);
        ɵɵelementContainerEnd();
      }
      if (rf & 2) {
        ɵɵadvance();
        ɵɵrepeater(ctx.resolvedLayers());
      }
    },
    styles: ["[_nghost-%COMP%]{position:absolute;overflow:visible;width:100%;height:100%;left:0;top:0;transform-origin:0 0;pointer-events:none}.f-canvas-dragging[_nghost-%COMP%], .canvas-dragging[_nghost-%COMP%]{transform:translateZ(0)}.f-groups-container[_ngcontent-%COMP%], .f-connections-container[_ngcontent-%COMP%], .f-nodes-container[_ngcontent-%COMP%]{isolation:isolate}.f-connections-container[_ngcontent-%COMP%]{position:absolute}"],
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FCanvasComponent, [{
    type: Component,
    args: [{
      selector: "f-canvas",
      standalone: true,
      host: {
        "class": "f-component f-canvas"
      },
      providers: [{
        provide: F_CANVAS,
        useExisting: FCanvasComponent
      }],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<ng-container>
  @for (layer of resolvedLayers(); track layer) {
    @switch (layer) {
      @case ('groups') {
        <div #fGroupsContainer class="f-groups-container">
          <ng-content select="[fGroup], [fGroups]" />
        </div>
      }
      @case ('connections') {
        <div #fConnectionsContainer class="f-connections-container">
          <ng-content select="f-snap-connection" />
          <ng-content select="f-connection, [fConnections]" />
          <ng-content select="f-connection-for-create" />
        </div>
      }
      @case ('nodes') {
        <div #fNodesContainer class="f-nodes-container">
          <ng-content select="[fNode], [fNodes]" />
        </div>
      }
    }
  }
</ng-container>
`,
      styles: [":host{position:absolute;overflow:visible;width:100%;height:100%;left:0;top:0;transform-origin:0 0;pointer-events:none}:host.f-canvas-dragging,:host.canvas-dragging{transform:translateZ(0)}.f-groups-container,.f-connections-container,.f-nodes-container{isolation:isolate}.f-connections-container{position:absolute}\n"]
    }]
  }], null, {
    fCanvasChange: [{
      type: Output,
      args: ["fCanvasChange"]
    }],
    position: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "position",
        required: false
      }]
    }],
    scale: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "scale",
        required: false
      }]
    }],
    debounceTime: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "debounceTime",
        required: false
      }]
    }],
    fLayers: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fLayers",
        required: false
      }]
    }],
    fGroupsContainer: [{
      type: ViewChild,
      args: ["fGroupsContainer", {
        isSignal: true
      }]
    }],
    fNodesContainer: [{
      type: ViewChild,
      args: ["fNodesContainer", {
        isSignal: true
      }]
    }],
    fConnectionsContainer: [{
      type: ViewChild,
      args: ["fConnectionsContainer", {
        isSignal: true
      }]
    }]
  });
})();
var F_CANVAS_PROVIDERS = [FCanvasComponent];
var uniqueId$3 = 0;
var FConnectionComponent = class _FConnectionComponent extends FConnectionBase {
  fId = input(`f-connection-${uniqueId$3++}`, ...ngDevMode ? [{
    debugName: "fId",
    alias: "fConnectionId"
  }] : [{
    alias: "fConnectionId"
  }]);
  fOutputId = input("", ...ngDevMode ? [{
    debugName: "fOutputId",
    transform: (value) => stringAttribute(value) || ""
  }] : [{
    transform: (value) => stringAttribute(value) || ""
  }]);
  fInputId = input("", ...ngDevMode ? [{
    debugName: "fInputId",
    transform: (value) => stringAttribute(value) || ""
  }] : [{
    transform: (value) => stringAttribute(value) || ""
  }]);
  fRadius = 8;
  fOffset = 12;
  fBehavior = EFConnectionBehavior.FIXED;
  fType = EFConnectionType.STRAIGHT;
  fSelectionDisabled = input(false, ...ngDevMode ? [{
    debugName: "fSelectionDisabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]);
  fReassignableStart = input(false, ...ngDevMode ? [{
    debugName: "fReassignableStart",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]);
  fDraggingDisabled = input(false, ...ngDevMode ? [{
    debugName: "fDraggingDisabled",
    alias: "fReassignDisabled",
    transform: booleanAttribute
  }] : [{
    alias: "fReassignDisabled",
    transform: booleanAttribute
  }]);
  fInputSide = input(EFConnectionConnectableSide.DEFAULT, ...ngDevMode ? [{
    debugName: "fInputSide",
    transform: (x) => {
      return castToEnum(x, "fInputSide", EFConnectionConnectableSide);
    }
  }] : [{
    transform: (x) => {
      return castToEnum(x, "fInputSide", EFConnectionConnectableSide);
    }
  }]);
  fOutputSide = input(EFConnectionConnectableSide.DEFAULT, ...ngDevMode ? [{
    debugName: "fOutputSide",
    transform: (x) => {
      return castToEnum(x, "fOutputSide", EFConnectionConnectableSide);
    }
  }] : [{
    transform: (x) => {
      return castToEnum(x, "fOutputSide", EFConnectionConnectableSide);
    }
  }]);
  get boundingElement() {
    return this.fPath().hostElement;
  }
  _mediator = inject(FMediator);
  ngOnInit() {
    this._mediator.execute(new AddConnectionToStoreRequest(this));
  }
  ngOnChanges() {
    this._mediator.execute(new EmitConnectionsChangesRequest());
  }
  ngOnDestroy() {
    this._mediator.execute(new RemoveConnectionFromStoreRequest(this));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFConnectionComponent_BaseFactory;
    return function FConnectionComponent_Factory(__ngFactoryType__) {
      return (ɵFConnectionComponent_BaseFactory || (ɵFConnectionComponent_BaseFactory = ɵɵgetInheritedFactory(_FConnectionComponent)))(__ngFactoryType__ || _FConnectionComponent);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _FConnectionComponent,
    selectors: [["f-connection"]],
    hostAttrs: [1, "f-component", "f-connection"],
    hostVars: 6,
    hostBindings: function FConnectionComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("id", ctx.fId())("data-f-connection-type", ctx.fType);
        ɵɵclassProp("f-connection-selection-disabled", ctx.fSelectionDisabled())("f-connection-reassign-disabled", ctx.fDraggingDisabled());
      }
    },
    inputs: {
      fId: [1, "fConnectionId", "fId"],
      fOutputId: [1, "fOutputId"],
      fInputId: [1, "fInputId"],
      fRadius: [2, "fRadius", "fRadius", numberAttribute],
      fOffset: [2, "fOffset", "fOffset", numberAttribute],
      fBehavior: [2, "fBehavior", "fBehavior", (value) => castToEnum(value, "fBehavior", EFConnectionBehavior)],
      fType: "fType",
      fSelectionDisabled: [1, "fSelectionDisabled"],
      fReassignableStart: [1, "fReassignableStart"],
      fDraggingDisabled: [1, "fReassignDisabled", "fDraggingDisabled"],
      fInputSide: [1, "fInputSide"],
      fOutputSide: [1, "fOutputSide"]
    },
    exportAs: ["fComponent"],
    standalone: false,
    features: [ɵɵProvidersFeature([{
      provide: F_CONNECTION_COMPONENTS_PARENT,
      useExisting: _FConnectionComponent
    }]), ɵɵInheritDefinitionFeature, ɵɵNgOnChangesFeature],
    ngContentSelectors: _c14,
    decls: 15,
    vars: 6,
    consts: [["defs", ""], ["xmlns", "http://www.w3.org/2000/svg"], [1, "f-connection-group"], ["fConnectionGradientRenderer", "", 3, "fConnectionGradientRendererFor"], ["fConnectionSelection", ""], ["f-connection-path", "", 3, "useGradient"], ["f-connection-drag-handle-start", "", "r", "8"], ["f-connection-drag-handle-end", "", "r", "8"]],
    template: function FConnectionComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef(_c13);
        ɵɵnamespaceSVG();
        ɵɵelementStart(0, "svg", 1);
        ɵɵelement(1, "defs", null, 0);
        ɵɵprojection(3);
        ɵɵelementStart(4, "g", 2);
        ɵɵtemplate(5, FConnectionComponent_Conditional_5_Template, 1, 1, ":svg:linearGradient", 3);
        ɵɵelement(6, "path", 4);
        ɵɵelementStart(7, "g");
        ɵɵelement(8, "path", 5);
        ɵɵtemplate(9, FConnectionComponent_Conditional_9_Template, 1, 0, ":svg:circle", 6);
        ɵɵelement(10, "circle", 7);
        ɵɵelementEnd()()();
        ɵɵprojection(11, 1);
        ɵɵprojection(12, 2);
        ɵɵprojection(13, 3);
        ɵɵtemplate(14, FConnectionComponent_Conditional_14_Template, 1, 0);
      }
      if (rf & 2) {
        let tmp_1_0;
        ɵɵadvance(5);
        ɵɵconditional((tmp_1_0 = ctx.fGradient()) ? 5 : -1, tmp_1_0);
        ɵɵadvance();
        ɵɵattribute("d", ctx.path);
        ɵɵadvance(2);
        ɵɵproperty("useGradient", !!ctx.fGradient());
        ɵɵattribute("d", ctx.path);
        ɵɵadvance();
        ɵɵconditional(ctx.fReassignableStart() ? 9 : -1);
        ɵɵadvance(5);
        ɵɵconditional(ctx.fContents().length ? 14 : -1);
      }
    },
    dependencies: [FConnectionGradientRenderer, FConnectionDragHandleStart, FConnectionDragHandleEnd, FConnectionPath, FConnectionSelection],
    styles: ["[_nghost-%COMP%]{pointer-events:none}[_nghost-%COMP%]   svg[_ngcontent-%COMP%]{display:block;vertical-align:middle;overflow:visible!important;position:absolute}[_nghost-%COMP%]   svg[_ngcontent-%COMP%]   .f-connection-group[_ngcontent-%COMP%]{pointer-events:all}[_nghost-%COMP%]   .f-connection-content[_ngcontent-%COMP%]{pointer-events:all}"],
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FConnectionComponent, [{
    type: Component,
    args: [{
      standalone: false,
      selector: "f-connection",
      exportAs: "fComponent",
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "[attr.id]": "fId()",
        "[attr.data-f-connection-type]": "fType",
        class: "f-component f-connection",
        "[class.f-connection-selection-disabled]": "fSelectionDisabled()",
        "[class.f-connection-reassign-disabled]": "fDraggingDisabled()"
      },
      providers: [{
        provide: F_CONNECTION_COMPONENTS_PARENT,
        useExisting: FConnectionComponent
      }],
      template: '<svg xmlns="http://www.w3.org/2000/svg">\n  <defs #defs></defs>\n  <ng-content select="svg[fMarker]" />\n  <g class="f-connection-group">\n    @if (fGradient(); as gradient) {\n      <linearGradient\n        fConnectionGradientRenderer\n        [fConnectionGradientRendererFor]="gradient"\n      ></linearGradient>\n    }\n    <path fConnectionSelection [attr.d]="path"></path>\n    <g>\n      <path f-connection-path [useGradient]="!!fGradient()" [attr.d]="path"></path>\n      @if (fReassignableStart()) {\n        <circle f-connection-drag-handle-start r="8"></circle>\n      }\n      <circle f-connection-drag-handle-end r="8"></circle>\n    </g>\n  </g>\n</svg>\n<ng-content select="f-connection-marker-circle, f-connection-marker-arrow" />\n<ng-content select="f-connection-gradient" />\n<ng-content select="f-connection-waypoints" />\n\n@if (fContents().length) {\n  <ng-content select="[fConnectionContent]" />\n}\n',
      styles: [":host{pointer-events:none}:host svg{display:block;vertical-align:middle;overflow:visible!important;position:absolute}:host svg .f-connection-group{pointer-events:all}:host .f-connection-content{pointer-events:all}\n"]
    }]
  }], null, {
    fId: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fConnectionId",
        required: false
      }]
    }],
    fOutputId: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fOutputId",
        required: false
      }]
    }],
    fInputId: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fInputId",
        required: false
      }]
    }],
    fRadius: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    fOffset: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    fBehavior: [{
      type: Input,
      args: [{
        transform: (value) => castToEnum(value, "fBehavior", EFConnectionBehavior)
      }]
    }],
    fType: [{
      type: Input
    }],
    fSelectionDisabled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fSelectionDisabled",
        required: false
      }]
    }],
    fReassignableStart: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fReassignableStart",
        required: false
      }]
    }],
    fDraggingDisabled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fReassignDisabled",
        required: false
      }]
    }],
    fInputSide: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fInputSide",
        required: false
      }]
    }],
    fOutputSide: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fOutputSide",
        required: false
      }]
    }]
  });
})();
var uniqueId$2 = 0;
var FConnectionForCreateComponent = class _FConnectionForCreateComponent extends FConnectionBase {
  fId = signal(`f-connection-for-create-${uniqueId$2++}`, ...ngDevMode ? [{
    debugName: "fId"
  }] : []);
  fOutputId = signal("", ...ngDevMode ? [{
    debugName: "fOutputId"
  }] : []);
  fInputId = signal("", ...ngDevMode ? [{
    debugName: "fInputId"
  }] : []);
  fRadius = 8;
  fOffset = 12;
  fBehavior = EFConnectionBehavior.FIXED;
  fType = EFConnectionType.STRAIGHT;
  fInputSide = input(EFConnectionConnectableSide.DEFAULT, ...ngDevMode ? [{
    debugName: "fInputSide",
    transform: (x) => {
      return castToEnum(x, "fInputSide", EFConnectionConnectableSide);
    }
  }] : [{
    transform: (x) => {
      return castToEnum(x, "fInputSide", EFConnectionConnectableSide);
    }
  }]);
  fOutputSide = input(EFConnectionConnectableSide.DEFAULT, ...ngDevMode ? [{
    debugName: "fOutputSide",
    transform: (x) => {
      return castToEnum(x, "fOutputSide", EFConnectionConnectableSide);
    }
  }] : [{
    transform: (x) => {
      return castToEnum(x, "fOutputSide", EFConnectionConnectableSide);
    }
  }]);
  get boundingElement() {
    return this.fPath().hostElement;
  }
  _mediator = inject(FMediator);
  ngOnInit() {
    this._mediator.execute(new AddConnectionForCreateToStoreRequest(this));
  }
  ngAfterViewInit() {
    this.hide();
  }
  ngOnChanges() {
    this._mediator.execute(new EmitConnectionsChangesRequest());
  }
  ngOnDestroy() {
    this._mediator.execute(new RemoveConnectionForCreateFromStoreRequest());
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFConnectionForCreateComponent_BaseFactory;
    return function FConnectionForCreateComponent_Factory(__ngFactoryType__) {
      return (ɵFConnectionForCreateComponent_BaseFactory || (ɵFConnectionForCreateComponent_BaseFactory = ɵɵgetInheritedFactory(_FConnectionForCreateComponent)))(__ngFactoryType__ || _FConnectionForCreateComponent);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _FConnectionForCreateComponent,
    selectors: [["f-connection-for-create"]],
    hostAttrs: [1, "f-component", "f-connection", "f-connection-for-create"],
    inputs: {
      fRadius: [2, "fRadius", "fRadius", numberAttribute],
      fOffset: [2, "fOffset", "fOffset", numberAttribute],
      fBehavior: [2, "fBehavior", "fBehavior", (value) => castToEnum(value, "fBehavior", EFConnectionBehavior)],
      fType: "fType",
      fInputSide: [1, "fInputSide"],
      fOutputSide: [1, "fOutputSide"]
    },
    standalone: false,
    features: [ɵɵProvidersFeature([{
      provide: F_CONNECTION_COMPONENTS_PARENT,
      useExisting: _FConnectionForCreateComponent
    }]), ɵɵInheritDefinitionFeature, ɵɵNgOnChangesFeature],
    ngContentSelectors: _c16,
    decls: 13,
    vars: 5,
    consts: [["defs", ""], ["xmlns", "http://www.w3.org/2000/svg"], [1, "f-connection-group"], ["fConnectionGradientRenderer", "", 3, "fConnectionGradientRendererFor"], ["fConnectionSelection", ""], ["f-connection-path", "", 3, "useGradient"], ["f-connection-drag-handle-end", "", "r", "8"]],
    template: function FConnectionForCreateComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef(_c15);
        ɵɵnamespaceSVG();
        ɵɵelementStart(0, "svg", 1);
        ɵɵelement(1, "defs", null, 0);
        ɵɵprojection(3);
        ɵɵelementStart(4, "g", 2);
        ɵɵtemplate(5, FConnectionForCreateComponent_Conditional_5_Template, 1, 1, ":svg:linearGradient", 3);
        ɵɵelement(6, "path", 4);
        ɵɵelementStart(7, "g");
        ɵɵelement(8, "path", 5)(9, "circle", 6);
        ɵɵelementEnd()()();
        ɵɵprojection(10, 1);
        ɵɵprojection(11, 2);
        ɵɵtemplate(12, FConnectionForCreateComponent_Conditional_12_Template, 1, 0);
      }
      if (rf & 2) {
        let tmp_1_0;
        ɵɵadvance(5);
        ɵɵconditional((tmp_1_0 = ctx.fGradient()) ? 5 : -1, tmp_1_0);
        ɵɵadvance();
        ɵɵattribute("d", ctx.path);
        ɵɵadvance(2);
        ɵɵproperty("useGradient", !!ctx.fGradient());
        ɵɵattribute("d", ctx.path);
        ɵɵadvance(4);
        ɵɵconditional(ctx.fContents().length ? 12 : -1);
      }
    },
    dependencies: [FConnectionGradientRenderer, FConnectionDragHandleEnd, FConnectionPath, FConnectionSelection],
    styles: ["[_nghost-%COMP%]{pointer-events:none;position:absolute}[_nghost-%COMP%]   svg[_ngcontent-%COMP%]{overflow:visible}[_nghost-%COMP%]   svg[_ngcontent-%COMP%]   .f-connection-group[_ngcontent-%COMP%]{pointer-events:all}[_nghost-%COMP%]   .f-connection-content[_ngcontent-%COMP%]{pointer-events:all}"],
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FConnectionForCreateComponent, [{
    type: Component,
    args: [{
      standalone: false,
      selector: "f-connection-for-create",
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        class: "f-component f-connection f-connection-for-create"
      },
      providers: [{
        provide: F_CONNECTION_COMPONENTS_PARENT,
        useExisting: FConnectionForCreateComponent
      }],
      template: '<svg xmlns="http://www.w3.org/2000/svg">\n  <defs #defs></defs>\n  <ng-content select="svg[fMarker]" />\n  <g class="f-connection-group">\n    @if (fGradient(); as gradient) {\n      <linearGradient\n        fConnectionGradientRenderer\n        [fConnectionGradientRendererFor]="gradient"\n      ></linearGradient>\n    }\n    <path fConnectionSelection [attr.d]="path"></path>\n    <g>\n      <path f-connection-path [useGradient]="!!fGradient()" [attr.d]="path"></path>\n      <circle f-connection-drag-handle-end r="8"></circle>\n    </g>\n  </g>\n</svg>\n<ng-content select="f-connection-marker-circle, f-connection-marker-arrow" />\n<ng-content select="f-connection-gradient" />\n\n@if (fContents().length) {\n  <ng-content select="[fConnectionContent]" />\n}\n',
      styles: [":host{pointer-events:none;position:absolute}:host svg{overflow:visible}:host svg .f-connection-group{pointer-events:all}:host .f-connection-content{pointer-events:all}\n"]
    }]
  }], null, {
    fRadius: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    fOffset: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    fBehavior: [{
      type: Input,
      args: [{
        transform: (value) => castToEnum(value, "fBehavior", EFConnectionBehavior)
      }]
    }],
    fType: [{
      type: Input
    }],
    fInputSide: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fInputSide",
        required: false
      }]
    }],
    fOutputSide: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fOutputSide",
        required: false
      }]
    }]
  });
})();
var uniqueId$1 = 0;
var FSnapConnectionComponent = class _FSnapConnectionComponent extends FConnectionBase {
  fId = signal(`f-snap-connection-${uniqueId$1++}`, ...ngDevMode ? [{
    debugName: "fId"
  }] : []);
  fSnapThreshold = 20;
  fOutputId = signal("", ...ngDevMode ? [{
    debugName: "fOutputId"
  }] : []);
  fInputId = signal("", ...ngDevMode ? [{
    debugName: "fInputId"
  }] : []);
  fRadius = 8;
  fOffset = 12;
  fBehavior = EFConnectionBehavior.FIXED;
  fType = EFConnectionType.STRAIGHT;
  fInputSide = input(EFConnectionConnectableSide.DEFAULT, ...ngDevMode ? [{
    debugName: "fInputSide",
    transform: (x) => {
      return castToEnum(x, "fInputSide", EFConnectionConnectableSide);
    }
  }] : [{
    transform: (x) => {
      return castToEnum(x, "fInputSide", EFConnectionConnectableSide);
    }
  }]);
  fOutputSide = input(EFConnectionConnectableSide.DEFAULT, ...ngDevMode ? [{
    debugName: "fOutputSide",
    transform: (x) => {
      return castToEnum(x, "fOutputSide", EFConnectionConnectableSide);
    }
  }] : [{
    transform: (x) => {
      return castToEnum(x, "fOutputSide", EFConnectionConnectableSide);
    }
  }]);
  get boundingElement() {
    return this.fPath().hostElement;
  }
  _mediator = inject(FMediator);
  ngOnInit() {
    this._mediator.execute(new AddSnapConnectionToStoreRequest(this));
  }
  ngAfterViewInit() {
    this.hide();
  }
  ngOnChanges() {
    this._mediator.execute(new EmitConnectionsChangesRequest());
  }
  ngOnDestroy() {
    this._mediator.execute(new RemoveSnapConnectionFromStoreRequest());
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFSnapConnectionComponent_BaseFactory;
    return function FSnapConnectionComponent_Factory(__ngFactoryType__) {
      return (ɵFSnapConnectionComponent_BaseFactory || (ɵFSnapConnectionComponent_BaseFactory = ɵɵgetInheritedFactory(_FSnapConnectionComponent)))(__ngFactoryType__ || _FSnapConnectionComponent);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _FSnapConnectionComponent,
    selectors: [["f-snap-connection"]],
    hostAttrs: [1, "f-component", "f-connection", "f-snap-connection"],
    inputs: {
      fSnapThreshold: [2, "fSnapThreshold", "fSnapThreshold", numberAttribute],
      fRadius: [2, "fRadius", "fRadius", numberAttribute],
      fOffset: [2, "fOffset", "fOffset", numberAttribute],
      fBehavior: [2, "fBehavior", "fBehavior", (value) => castToEnum(value, "fBehavior", EFConnectionBehavior)],
      fType: "fType",
      fInputSide: [1, "fInputSide"],
      fOutputSide: [1, "fOutputSide"]
    },
    standalone: false,
    features: [ɵɵProvidersFeature([{
      provide: F_CONNECTION_COMPONENTS_PARENT,
      useExisting: _FSnapConnectionComponent
    }]), ɵɵInheritDefinitionFeature, ɵɵNgOnChangesFeature],
    ngContentSelectors: _c16,
    decls: 13,
    vars: 5,
    consts: [["defs", ""], ["xmlns", "http://www.w3.org/2000/svg"], [1, "f-connection-group"], ["fConnectionGradientRenderer", "", 3, "fConnectionGradientRendererFor"], ["fConnectionSelection", ""], ["f-connection-path", "", 3, "useGradient"], ["f-connection-drag-handle-end", "", "r", "8"]],
    template: function FSnapConnectionComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef(_c15);
        ɵɵnamespaceSVG();
        ɵɵelementStart(0, "svg", 1);
        ɵɵelement(1, "defs", null, 0);
        ɵɵprojection(3);
        ɵɵelementStart(4, "g", 2);
        ɵɵtemplate(5, FSnapConnectionComponent_Conditional_5_Template, 1, 1, ":svg:linearGradient", 3);
        ɵɵelement(6, "path", 4);
        ɵɵelementStart(7, "g");
        ɵɵelement(8, "path", 5)(9, "circle", 6);
        ɵɵelementEnd()()();
        ɵɵprojection(10, 1);
        ɵɵprojection(11, 2);
        ɵɵtemplate(12, FSnapConnectionComponent_Conditional_12_Template, 1, 0);
      }
      if (rf & 2) {
        let tmp_1_0;
        ɵɵadvance(5);
        ɵɵconditional((tmp_1_0 = ctx.fGradient()) ? 5 : -1, tmp_1_0);
        ɵɵadvance();
        ɵɵattribute("d", ctx.path);
        ɵɵadvance(2);
        ɵɵproperty("useGradient", !!ctx.fGradient());
        ɵɵattribute("d", ctx.path);
        ɵɵadvance(4);
        ɵɵconditional(ctx.fContents().length ? 12 : -1);
      }
    },
    dependencies: [FConnectionGradientRenderer, FConnectionDragHandleEnd, FConnectionPath, FConnectionSelection],
    styles: [_c17],
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FSnapConnectionComponent, [{
    type: Component,
    args: [{
      standalone: false,
      selector: "f-snap-connection",
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        class: "f-component f-connection f-snap-connection"
      },
      providers: [{
        provide: F_CONNECTION_COMPONENTS_PARENT,
        useExisting: FSnapConnectionComponent
      }],
      template: '<svg xmlns="http://www.w3.org/2000/svg">\n  <defs #defs></defs>\n  <ng-content select="svg[fMarker]" />\n  <g class="f-connection-group">\n    @if (fGradient(); as gradient) {\n      <linearGradient\n        fConnectionGradientRenderer\n        [fConnectionGradientRendererFor]="gradient"\n      ></linearGradient>\n    }\n    <path fConnectionSelection [attr.d]="path"></path>\n    <g>\n      <path f-connection-path [useGradient]="!!fGradient()" [attr.d]="path"></path>\n      <circle f-connection-drag-handle-end r="8"></circle>\n    </g>\n  </g>\n</svg>\n<ng-content select="f-connection-marker-circle, f-connection-marker-arrow" />\n<ng-content select="f-connection-gradient" />\n\n@if (fContents().length) {\n  <ng-content select="[fConnectionContent]" />\n}\n',
      styles: [":host{pointer-events:none;position:absolute}:host svg{overflow:visible}:host svg .f-connection-group{pointer-events:all}:host .f-connection-content{pointer-events:all}\n"]
    }]
  }], null, {
    fSnapThreshold: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    fRadius: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    fOffset: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    fBehavior: [{
      type: Input,
      args: [{
        transform: (value) => castToEnum(value, "fBehavior", EFConnectionBehavior)
      }]
    }],
    fType: [{
      type: Input
    }],
    fInputSide: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fInputSide",
        required: false
      }]
    }],
    fOutputSide: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fOutputSide",
        required: false
      }]
    }]
  });
})();
var F_CONNECTION_PROVIDERS = [FConnectionDragHandleStart, FConnectionDragHandleEnd, FConnectionPath, FConnectionSelection, FConnectionMarker, FConnectionComponent, FConnectionForCreateComponent, FSnapConnectionComponent];
var F_CONNECTION_IMPORTS_EXPORTS = [FConnectionContent, FConnectionMarkerCircle, FConnectionMarkerArrow, FConnectionGradient, FConnectionGradientRenderer, FConnectionWaypoints];
var F_MAGNETIC_LINES = new InjectionToken("F_MAGNETIC_LINES");
var FMagneticLinesBase = class _FMagneticLinesBase {
  hostElement = inject(ElementRef).nativeElement;
  static ɵfac = function FMagneticLinesBase_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FMagneticLinesBase)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FMagneticLinesBase
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FMagneticLinesBase, [{
    type: Directive
  }], null, null);
})();
var FMagneticLines = class _FMagneticLines extends FMagneticLinesBase {
  threshold = input(10, ...ngDevMode ? [{
    debugName: "threshold",
    transform: numberAttribute
  }] : [{
    transform: numberAttribute
  }]);
  _mediator = inject(FMediator);
  ngOnInit() {
    this._mediator.execute(new RegisterPluginInstanceRequest(INSTANCES.MAGNETIC_LINES, this));
  }
  ngOnDestroy() {
    this._mediator.execute(new RemovePluginInstanceRequest(INSTANCES.MAGNETIC_LINES));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFMagneticLines_BaseFactory;
    return function FMagneticLines_Factory(__ngFactoryType__) {
      return (ɵFMagneticLines_BaseFactory || (ɵFMagneticLines_BaseFactory = ɵɵgetInheritedFactory(_FMagneticLines)))(__ngFactoryType__ || _FMagneticLines);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _FMagneticLines,
    selectors: [["f-magnetic-lines"]],
    hostAttrs: [1, "f-magnetic-lines", "f-component"],
    inputs: {
      threshold: [1, "threshold"]
    },
    features: [ɵɵProvidersFeature([{
      provide: F_MAGNETIC_LINES,
      useExisting: _FMagneticLines
    }]), ɵɵInheritDefinitionFeature],
    decls: 0,
    vars: 0,
    template: function FMagneticLines_Template(rf, ctx) {
    },
    styles: ["[_nghost-%COMP%]{display:block;position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden;pointer-events:none;-webkit-user-select:none;user-select:none}"],
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FMagneticLines, [{
    type: Component,
    args: [{
      selector: "f-magnetic-lines",
      template: "",
      host: {
        "class": "f-magnetic-lines f-component"
      },
      standalone: true,
      providers: [{
        provide: F_MAGNETIC_LINES,
        useExisting: FMagneticLines
      }],
      changeDetection: ChangeDetectionStrategy.OnPush,
      styles: [":host{display:block;position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden;pointer-events:none;-webkit-user-select:none;user-select:none}\n"]
    }]
  }], null, {
    threshold: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "threshold",
        required: false
      }]
    }]
  });
})();
var F_MAGNETIC_LINES_PROVIDERS = [FMagneticLines];
var FLineAlignmentComponent = class _FLineAlignmentComponent extends FMagneticLinesBase {
  threshold = input(10, ...ngDevMode ? [{
    debugName: "threshold",
    transform: numberAttribute,
    alias: "fAlignThreshold"
  }] : [{
    transform: numberAttribute,
    alias: "fAlignThreshold"
  }]);
  _mediator = inject(FMediator);
  ngOnInit() {
    this._mediator.execute(new RegisterPluginInstanceRequest(INSTANCES.MAGNETIC_LINES, this));
  }
  ngOnDestroy() {
    this._mediator.execute(new RemovePluginInstanceRequest(INSTANCES.MAGNETIC_LINES));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFLineAlignmentComponent_BaseFactory;
    return function FLineAlignmentComponent_Factory(__ngFactoryType__) {
      return (ɵFLineAlignmentComponent_BaseFactory || (ɵFLineAlignmentComponent_BaseFactory = ɵɵgetInheritedFactory(_FLineAlignmentComponent)))(__ngFactoryType__ || _FLineAlignmentComponent);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _FLineAlignmentComponent,
    selectors: [["f-line-alignment"]],
    hostAttrs: [1, "f-line-alignment", "f-component"],
    inputs: {
      threshold: [1, "fAlignThreshold", "threshold"]
    },
    exportAs: ["fComponent"],
    standalone: false,
    features: [ɵɵProvidersFeature([{
      provide: F_MAGNETIC_LINES,
      useExisting: _FLineAlignmentComponent
    }]), ɵɵInheritDefinitionFeature],
    decls: 0,
    vars: 0,
    template: function FLineAlignmentComponent_Template(rf, ctx) {
    },
    styles: [_c18]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FLineAlignmentComponent, [{
    type: Component,
    args: [{
      standalone: false,
      selector: "f-line-alignment",
      template: "",
      exportAs: "fComponent",
      host: {
        "class": "f-line-alignment f-component"
      },
      providers: [{
        provide: F_MAGNETIC_LINES,
        useExisting: FLineAlignmentComponent
      }],
      styles: [":host{display:block;position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden;pointer-events:none;-webkit-user-select:none;user-select:none}\n"]
    }]
  }], null, {
    threshold: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fAlignThreshold",
        required: false
      }]
    }]
  });
})();
var F_LINE_ALIGNMENT_PROVIDERS = [FLineAlignmentComponent];
var F_MAGNETIC_RECTS = new InjectionToken("F_MAGNETIC_RECTS");
var FMagneticRectsBase = class _FMagneticRectsBase {
  hostElement = inject(ElementRef).nativeElement;
  static ɵfac = function FMagneticRectsBase_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FMagneticRectsBase)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FMagneticRectsBase
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FMagneticRectsBase, [{
    type: Directive
  }], null, null);
})();
var FMagneticRects = class _FMagneticRects extends FMagneticRectsBase {
  alignThreshold = input(100, ...ngDevMode ? [{
    debugName: "alignThreshold",
    transform: numberAttribute
  }] : [{
    transform: numberAttribute
  }]);
  spacingThreshold = input(100, ...ngDevMode ? [{
    debugName: "spacingThreshold",
    transform: numberAttribute
  }] : [{
    transform: numberAttribute
  }]);
  _mediator = inject(FMediator);
  ngOnInit() {
    this._mediator.execute(new RegisterPluginInstanceRequest(INSTANCES.MAGNETIC_RECTS, this));
  }
  ngOnDestroy() {
    this._mediator.execute(new RemovePluginInstanceRequest(INSTANCES.MAGNETIC_RECTS));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFMagneticRects_BaseFactory;
    return function FMagneticRects_Factory(__ngFactoryType__) {
      return (ɵFMagneticRects_BaseFactory || (ɵFMagneticRects_BaseFactory = ɵɵgetInheritedFactory(_FMagneticRects)))(__ngFactoryType__ || _FMagneticRects);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _FMagneticRects,
    selectors: [["f-magnetic-rects"]],
    hostAttrs: [1, "f-magnetic-rects", "f-component"],
    inputs: {
      alignThreshold: [1, "alignThreshold"],
      spacingThreshold: [1, "spacingThreshold"]
    },
    features: [ɵɵProvidersFeature([{
      provide: F_MAGNETIC_RECTS,
      useExisting: _FMagneticRects
    }]), ɵɵInheritDefinitionFeature],
    decls: 0,
    vars: 0,
    template: function FMagneticRects_Template(rf, ctx) {
    },
    styles: [_c18],
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FMagneticRects, [{
    type: Component,
    args: [{
      selector: "f-magnetic-rects",
      template: "",
      host: {
        "class": "f-magnetic-rects f-component"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      standalone: true,
      providers: [{
        provide: F_MAGNETIC_RECTS,
        useExisting: FMagneticRects
      }],
      styles: [":host{display:block;position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden;pointer-events:none;-webkit-user-select:none;user-select:none}\n"]
    }]
  }], null, {
    alignThreshold: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "alignThreshold",
        required: false
      }]
    }],
    spacingThreshold: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "spacingThreshold",
        required: false
      }]
    }]
  });
})();
var F_MAGNETIC_RECTS_PROVIDERS = [FMagneticRects];
var FMinimapFlowDirective = class _FMinimapFlowDirective {
  fMinSize = input(1e3, ...ngDevMode ? [{
    debugName: "fMinSize"
  }] : []);
  _mediator = inject(FMediator);
  hostElement = inject(ElementRef).nativeElement;
  model = new FMinimapState(this.hostElement);
  redraw() {
    const {
      scale,
      viewBox
    } = this._mediator.execute(new MinimapCalculateViewportRequest(this.hostElement, this.fMinSize()));
    this.model = new FMinimapState(this.hostElement, scale, viewBox);
    setRectToViewBox(viewBox, this.hostElement);
  }
  static ɵfac = function FMinimapFlowDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FMinimapFlowDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FMinimapFlowDirective,
    selectors: [["svg", "fMinimapFlow", ""]],
    inputs: {
      fMinSize: [1, "fMinSize"]
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FMinimapFlowDirective, [{
    type: Directive,
    args: [{
      selector: "svg[fMinimapFlow]",
      standalone: true
    }]
  }], null, {
    fMinSize: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fMinSize",
        required: false
      }]
    }]
  });
})();
var FMinimapCanvasDirective = class _FMinimapCanvasDirective {
  _mediator = inject(FMediator);
  _elementRef = inject(ElementRef);
  hostElement = this._elementRef.nativeElement;
  redraw() {
    this.clear();
    const fragment = this._elementRef.nativeElement.ownerDocument.createDocumentFragment();
    this._mediator.execute(new MinimapDrawNodesRequest()).forEach((x) => {
      fragment.appendChild(x);
    });
    this.hostElement.appendChild(fragment);
  }
  clear() {
    this.hostElement.replaceChildren();
  }
  static ɵfac = function FMinimapCanvasDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FMinimapCanvasDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FMinimapCanvasDirective,
    selectors: [["g", "fMinimapCanvas", ""]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FMinimapCanvasDirective, [{
    type: Directive,
    args: [{
      selector: "g[fMinimapCanvas]",
      standalone: true
    }]
  }], null, null);
})();
var FMinimapViewDirective = class _FMinimapViewDirective {
  _mediator = inject(FMediator);
  hostElement = inject(ElementRef).nativeElement;
  redraw() {
    setRectToElement(this._mediator.execute(new MinimapCalculateViewRectRequest()), this.hostElement);
  }
  static ɵfac = function FMinimapViewDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FMinimapViewDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FMinimapViewDirective,
    selectors: [["rect", "fMinimapView", ""]],
    hostAttrs: [1, "f-component", "f-minimap-view"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FMinimapViewDirective, [{
    type: Directive,
    args: [{
      selector: "rect[fMinimapView]",
      host: {
        "class": "f-component f-minimap-view"
      },
      standalone: true
    }]
  }], null, null);
})();
var F_MINIMAP_BASE = new InjectionToken("F_MINIMAP_BASE");
var FMinimapBase = class _FMinimapBase {
  hostElement = inject(ElementRef).nativeElement;
  static ɵfac = function FMinimapBase_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FMinimapBase)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FMinimapBase
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FMinimapBase, [{
    type: Directive
  }], null, null);
})();
var FMinimapComponent = class _FMinimapComponent extends FMinimapBase {
  _destroyRef = inject(DestroyRef);
  _mediator = inject(FMediator);
  _browser = inject(BrowserService);
  _store = inject(FComponentsStore);
  _canvas = viewChild.required(FMinimapCanvasDirective);
  _flow = viewChild.required(FMinimapFlowDirective);
  _minimapView = viewChild.required(FMinimapViewDirective);
  fMinSize = input(1e3, ...ngDevMode ? [{
    debugName: "fMinSize"
  }] : []);
  fNodeRenderLimit = input(1500, ...ngDevMode ? [{
    debugName: "fNodeRenderLimit",
    transform: numberAttribute
  }] : [{
    transform: numberAttribute
  }]);
  get state() {
    return this._flow().model;
  }
  ngOnInit() {
    this._mediator.execute(new RegisterPluginInstanceRequest(INSTANCES.MINIMAP, this));
  }
  ngAfterViewInit() {
    this._listenTransformChanges();
  }
  _listenTransformChanges() {
    this._mediator.execute(new ListenTransformChangesRequest()).pipe(notifyOnStart(), debounceAnimationFrame()).listen(this._destroyRef, () => {
      this._redraw();
    });
  }
  _redraw() {
    if (!this._browser.isBrowser()) {
      return;
    }
    if (this._isOverNodeRenderLimit()) {
      this._canvas().clear();
      return;
    }
    this._flow().redraw();
    this._minimapView().redraw();
    this._canvas().redraw();
  }
  _isOverNodeRenderLimit() {
    const limit = this.fNodeRenderLimit();
    return limit > 0 && this._store.nodes.size() > limit;
  }
  ngOnDestroy() {
    this._mediator.execute(new RemovePluginInstanceRequest(INSTANCES.MINIMAP));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFMinimapComponent_BaseFactory;
    return function FMinimapComponent_Factory(__ngFactoryType__) {
      return (ɵFMinimapComponent_BaseFactory || (ɵFMinimapComponent_BaseFactory = ɵɵgetInheritedFactory(_FMinimapComponent)))(__ngFactoryType__ || _FMinimapComponent);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _FMinimapComponent,
    selectors: [["f-minimap"]],
    viewQuery: function FMinimapComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuerySignal(ctx._canvas, FMinimapCanvasDirective, 5);
        ɵɵviewQuerySignal(ctx._flow, FMinimapFlowDirective, 5);
        ɵɵviewQuerySignal(ctx._minimapView, FMinimapViewDirective, 5);
      }
      if (rf & 2) {
        ɵɵqueryAdvance(3);
      }
    },
    hostAttrs: [1, "f-component", "f-minimap"],
    inputs: {
      fMinSize: [1, "fMinSize"],
      fNodeRenderLimit: [1, "fNodeRenderLimit"]
    },
    exportAs: ["fComponent"],
    features: [ɵɵProvidersFeature([{
      provide: F_MINIMAP_BASE,
      useExisting: _FMinimapComponent
    }]), ɵɵInheritDefinitionFeature],
    decls: 3,
    vars: 1,
    consts: [["fMinimapFlow", "", "width", "100%", "height", "100%", "fLockedContext", "", 3, "fMinSize"], ["fMinimapCanvas", ""], ["fMinimapView", "", "x", "0", "y", "0", "width", "100%", "height", "100%", "stroke", "none"]],
    template: function FMinimapComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵnamespaceSVG();
        ɵɵelementStart(0, "svg", 0);
        ɵɵelement(1, "g", 1)(2, "rect", 2);
        ɵɵelementEnd();
      }
      if (rf & 2) {
        ɵɵproperty("fMinSize", ctx.fMinSize());
      }
    },
    dependencies: [FMinimapFlowDirective, FMinimapCanvasDirective, FMinimapViewDirective],
    styles: ["[_nghost-%COMP%]{display:block;position:absolute}[_nghost-%COMP%]   svg[_ngcontent-%COMP%]{overflow:hidden}"],
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FMinimapComponent, [{
    type: Component,
    args: [{
      selector: "f-minimap",
      exportAs: "fComponent",
      host: {
        "class": "f-component f-minimap"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      standalone: true,
      providers: [{
        provide: F_MINIMAP_BASE,
        useExisting: FMinimapComponent
      }],
      imports: [FMinimapFlowDirective, FMinimapCanvasDirective, FMinimapViewDirective],
      template: '<svg fMinimapFlow width="100%" height="100%" fLockedContext [fMinSize]="fMinSize()">\n  <g fMinimapCanvas></g>\n  <rect fMinimapView x="0" y="0" width="100%" height="100%" stroke="none"/>\n</svg>\n\n',
      styles: [":host{display:block;position:absolute}:host svg{overflow:hidden}\n"]
    }]
  }], null, {
    _canvas: [{
      type: ViewChild,
      args: [forwardRef(() => FMinimapCanvasDirective), {
        isSignal: true
      }]
    }],
    _flow: [{
      type: ViewChild,
      args: [forwardRef(() => FMinimapFlowDirective), {
        isSignal: true
      }]
    }],
    _minimapView: [{
      type: ViewChild,
      args: [forwardRef(() => FMinimapViewDirective), {
        isSignal: true
      }]
    }],
    fMinSize: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fMinSize",
        required: false
      }]
    }],
    fNodeRenderLimit: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fNodeRenderLimit",
        required: false
      }]
    }]
  });
})();
var F_MINIMAP_PROVIDERS = [FMinimapComponent, FMinimapCanvasDirective, FMinimapViewDirective, FMinimapFlowDirective];
var FSelectionAreaBase = class _FSelectionAreaBase {
  hostElement = inject(ElementRef).nativeElement;
  initialize() {
    this.hostElement.style.display = "none";
  }
  static ɵfac = function FSelectionAreaBase_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FSelectionAreaBase)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FSelectionAreaBase
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FSelectionAreaBase, [{
    type: Directive
  }], null, null);
})();
var FSelectionArea = class _FSelectionArea extends FSelectionAreaBase {
  _mediator = inject(FMediator);
  fTrigger = (event) => {
    return event.shiftKey;
  };
  ngOnInit() {
    this._mediator.execute(new RegisterPluginInstanceRequest(INSTANCES.SELECTION_AREA, this));
    super.initialize();
  }
  ngOnDestroy() {
    this._mediator.execute(new RemovePluginInstanceRequest(INSTANCES.SELECTION_AREA));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFSelectionArea_BaseFactory;
    return function FSelectionArea_Factory(__ngFactoryType__) {
      return (ɵFSelectionArea_BaseFactory || (ɵFSelectionArea_BaseFactory = ɵɵgetInheritedFactory(_FSelectionArea)))(__ngFactoryType__ || _FSelectionArea);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _FSelectionArea,
    selectors: [["f-selection-area"]],
    hostAttrs: [1, "f-selection-area", "f-component"],
    inputs: {
      fTrigger: "fTrigger"
    },
    features: [ɵɵInheritDefinitionFeature],
    decls: 0,
    vars: 0,
    template: function FSelectionArea_Template(rf, ctx) {
    },
    styles: ["[_nghost-%COMP%]{position:absolute}"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FSelectionArea, [{
    type: Component,
    args: [{
      selector: "f-selection-area",
      template: ``,
      standalone: true,
      host: {
        "class": "f-selection-area f-component"
      },
      styles: [":host{position:absolute}\n"]
    }]
  }], null, {
    fTrigger: [{
      type: Input
    }]
  });
})();
var F_SELECTION_AREA_PROVIDERS = [FSelectionArea];
var uniqueId = 0;
var SORT_ITEM_LAYERS_DEBOUNCE_MS = 120;
var FFlowComponent = class _FFlowComponent extends FFlowBase {
  _destroyRef = inject(DestroyRef);
  _mediator = inject(FMediator);
  _browser = inject(BrowserService);
  _componentsStore = inject(FComponentsStore);
  _cache = inject(F_CACHE_OPTIONS);
  _injector = inject(Injector);
  _flowConfig = inject(F_FLOW_CONFIG, {
    optional: true
  });
  fId = input(this._flowConfig?.id ?? `f-flow-${uniqueId++}`, ...ngDevMode ? [{
    debugName: "fId",
    alias: "fFlowId"
  }] : [{
    alias: "fFlowId"
  }]);
  fCache = input(false, ...ngDevMode ? [{
    debugName: "fCache",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]);
  hostElement = inject(ElementRef).nativeElement;
  fNodesRendered = output();
  fFullRendered = output();
  /**
   * @deprecated Use `fFullRendered` instead.
   */
  fLoaded = output();
  ngOnInit() {
    this._mediator.execute(new AddFlowToStoreRequest(this));
    this._listenCacheChanges();
  }
  ngAfterContentInit() {
    if (!this._browser.isBrowser()) {
      return;
    }
    this._listenNodesChanges();
    this._listenConnectionsChanges();
  }
  _listenCacheChanges() {
    effect(() => {
      this._cache.enabled = this.fCache();
    }, {
      injector: this._injector
    });
  }
  _listenNodesChanges() {
    new FChannelHub(this._componentsStore.nodesChanges$, this._componentsStore.progressiveRenderChanges$).pipe(notifyOnStart(), debounceTime(SORT_ITEM_LAYERS_DEBOUNCE_MS), afterNextPaint()).listen(this._destroyRef, () => {
      if (this._mediator.execute(new IsDragStartedRequest())) {
        return;
      }
      if (this._componentsStore.hasPendingProgressiveRender) {
        return;
      }
      this._mediator.execute(new SortItemLayersRequest());
      this._mediator.execute(new NotifyNodesRenderedRequest());
      this._mediator.execute(new WaitForConnectionsRenderedRequest(this._componentsStore.connectionsRevision + 1, this._componentsStore.nodesRevision, () => this._mediator.execute(new NotifyFullRenderedRequest()), this._destroyRef));
      this._mediator.execute(new EmitConnectionsChangesRequest());
    });
  }
  _listenConnectionsChanges() {
    this._mediator.execute(new ListenConnectionsChangesRequest()).listen(this._destroyRef, () => {
      if (this._mediator.execute(new IsDragStartedRequest())) {
        return;
      }
      if (this._componentsStore.isViewportAnimating) {
        this._mediator.execute(new QueueConnectionRedrawRequest(this._destroyRef));
        return;
      }
      this._mediator.execute(new RedrawConnectionsRequest());
    });
  }
  redraw() {
    this._mediator.execute(new EmitConnectionsChangesRequest());
  }
  reset() {
    this._mediator.execute(new ResetRenderLifecycleRequest());
  }
  getNodesBoundingBox() {
    return this._mediator.execute(new CalculateNodesBoundingBoxNormalizedPositionRequest());
  }
  getSelection() {
    return this._mediator.execute(new GetCurrentSelectionRequest());
  }
  getPositionInFlow(position) {
    return this._mediator.execute(new GetNormalizedPointRequest(position));
  }
  getState(options) {
    return this._mediator.execute(new CalculateFlowStateRequest(options?.measuredSize ?? false));
  }
  selectAll() {
    this._mediator.execute(new ListenConnectionsChangesRequest()).pipe(takeOne()).listen(this._destroyRef, () => {
      this._mediator.execute(new SelectAllRequest());
    });
  }
  /**
   * Programmatically selects nodes and connections by their IDs.
   *
   * This method allows external components to control the selection state of the canvas.
   * Selected elements will appear visually highlighted. If `isSelectedChanged` is true,
   * the next user interaction (e.g., clicking the canvas) will emit a selection change event.
   *
   * @param nodes - An array of node IDs to select.
   * @param connections - An array of connection IDs to select.
   * @param isSelectedChanged - Optional. If true (default), marks the selection state as changed,
   * triggering a `fSelectionChange` event on the next user interaction.
   */
  select(nodes, connections, isSelectedChanged = true) {
    this._mediator.execute(new ListenConnectionsChangesRequest()).pipe(takeOne()).listen(this._destroyRef, () => {
      this._mediator.execute(new SelectRequest(nodes, connections, isSelectedChanged));
    });
  }
  clearSelection() {
    this._mediator.execute(new ClearSelectionRequest());
  }
  ngOnDestroy() {
    this._mediator.execute(new RemoveFlowFromStoreRequest(this));
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFFlowComponent_BaseFactory;
    return function FFlowComponent_Factory(__ngFactoryType__) {
      return (ɵFFlowComponent_BaseFactory || (ɵFFlowComponent_BaseFactory = ɵɵgetInheritedFactory(_FFlowComponent)))(__ngFactoryType__ || _FFlowComponent);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _FFlowComponent,
    selectors: [["f-flow"]],
    hostAttrs: [1, "f-component", "f-flow"],
    hostVars: 1,
    hostBindings: function FFlowComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("id", ctx.fId());
      }
    },
    inputs: {
      fId: [1, "fFlowId", "fId"],
      fCache: [1, "fCache"]
    },
    outputs: {
      fNodesRendered: "fNodesRendered",
      fFullRendered: "fFullRendered",
      fLoaded: "fLoaded"
    },
    features: [ɵɵProvidersFeature([FMediator, ...F_STORAGE_PROVIDERS, ConnectionLineBuilder, ConnectionBehaviourBuilder, ...COMMON_PROVIDERS, FDraggableDataContext, ...F_DRAGGABLE_PROVIDERS, ...F_REFLOW_PROVIDERS, {
      provide: F_FLOW,
      useExisting: _FFlowComponent
    }]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c20,
    decls: 7,
    vars: 0,
    template: function FFlowComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef(_c19);
        ɵɵelementContainerStart(0);
        ɵɵprojection(1);
        ɵɵprojection(2, 1);
        ɵɵprojection(3, 2);
        ɵɵprojection(4, 3);
        ɵɵprojection(5, 4);
        ɵɵprojection(6, 5);
        ɵɵelementContainerEnd();
      }
    },
    styles: ["[_nghost-%COMP%]{display:block;position:relative;width:100%;height:100%;overflow:hidden;pointer-events:all;-webkit-user-select:none;user-select:none;touch-action:none}  .f-connection-content{position:absolute;left:0;top:0;inline-size:max-content;pointer-events:all;transform-origin:50% 50%}  .f-node,   .f-group{position:absolute!important;transform-origin:center;-webkit-user-select:none;user-select:none;pointer-events:all;left:0!important;top:0!important;box-sizing:border-box}  .f-group{z-index:1}  .f-connection-content{z-index:3}  .f-node{z-index:4}.hidden[_ngcontent-%COMP%]{opacity:0}"],
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FFlowComponent, [{
    type: Component,
    args: [{
      selector: "f-flow",
      standalone: true,
      host: {
        "[attr.id]": "fId()",
        class: "f-component f-flow"
      },
      providers: [FMediator, ...F_STORAGE_PROVIDERS, ConnectionLineBuilder, ConnectionBehaviourBuilder, ...COMMON_PROVIDERS, FDraggableDataContext, ...F_DRAGGABLE_PROVIDERS, ...F_REFLOW_PROVIDERS, {
        provide: F_FLOW,
        useExisting: FFlowComponent
      }],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: '<ng-container>\n  <ng-content select="[fDefinitions]"/>\n\n  <ng-content select="f-background"/>\n\n  <ng-content select="f-line-alignment"/>\n\n  <ng-content select="f-canvas"/>\n\n  <ng-content select="f-selection-area"/>\n\n  <ng-content/>\n</ng-container>\n',
      styles: [":host{display:block;position:relative;width:100%;height:100%;overflow:hidden;pointer-events:all;-webkit-user-select:none;user-select:none;touch-action:none}::ng-deep .f-connection-content{position:absolute;left:0;top:0;inline-size:max-content;pointer-events:all;transform-origin:50% 50%}::ng-deep .f-node,::ng-deep .f-group{position:absolute!important;transform-origin:center;-webkit-user-select:none;user-select:none;pointer-events:all;left:0!important;top:0!important;box-sizing:border-box}::ng-deep .f-group{z-index:1}::ng-deep .f-connection-content{z-index:3}::ng-deep .f-node{z-index:4}.hidden{opacity:0}\n"]
    }]
  }], null, {
    fId: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fFlowId",
        required: false
      }]
    }],
    fCache: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fCache",
        required: false
      }]
    }],
    fNodesRendered: [{
      type: Output,
      args: ["fNodesRendered"]
    }],
    fFullRendered: [{
      type: Output,
      args: ["fFullRendered"]
    }],
    fLoaded: [{
      type: Output,
      args: ["fLoaded"]
    }]
  });
})();
var F_FLOW_PROVIDERS = [FFlowComponent];
var FVirtualFor = class _FVirtualFor {
  fVirtualForOf = [];
  _vc = inject(ViewContainerRef);
  _tpl = inject(TemplateRef);
  _zone = inject(NgZone);
  _componentsStore = inject(FComponentsStore, {
    optional: true
  });
  _rafId = null;
  _isProgressiveRenderActive = false;
  ngOnChanges(changes) {
    if (changes["fVirtualForOf"]) {
      this._reset();
      this._renderProgressively();
    }
  }
  ngOnDestroy() {
    this._reset();
  }
  _reset() {
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    this._finishProgressiveRender();
    this._vc.clear();
  }
  _renderProgressively() {
    const FRAME_BUDGET = 10;
    const CALIBRATION_SIZE = 5;
    const SAFETY_FACTOR = 0.9;
    let index = 0;
    this._startProgressiveRender();
    this._zone.runOutsideAngular(() => {
      const pump = () => {
        const total = this.fVirtualForOf.length;
        const start = performance.now();
        const calibrationEnd = Math.min(total, index + CALIBRATION_SIZE);
        let measuredViews = 0;
        while (index < calibrationEnd && (measuredViews === 0 || performance.now() - start < FRAME_BUDGET)) {
          this._insertView(index);
          index++;
          measuredViews++;
        }
        const elapsed = performance.now() - start;
        const done = index >= total;
        if (!done && elapsed < FRAME_BUDGET) {
          const msPerView = elapsed / measuredViews;
          const remainingBudget = (FRAME_BUDGET - elapsed) * SAFETY_FACTOR;
          const predicted = msPerView > 0 ? Math.floor(remainingBudget / msPerView) : 0;
          const limit = Math.min(total, index + predicted);
          while (index < limit) {
            this._insertView(index);
            index++;
          }
        }
        if (index < total) {
          this._rafId = requestAnimationFrame(pump);
          return;
        }
        this._rafId = null;
        this._finishProgressiveRender();
      };
      this._rafId = requestAnimationFrame(pump);
    });
  }
  _insertView(index) {
    this._vc.createEmbeddedView(this._tpl, {
      $implicit: this.fVirtualForOf[index],
      index
    });
  }
  _startProgressiveRender() {
    if (this._isProgressiveRenderActive) {
      return;
    }
    this._isProgressiveRenderActive = true;
    this._componentsStore?.beginProgressiveRender();
  }
  _finishProgressiveRender() {
    if (!this._isProgressiveRenderActive) {
      return;
    }
    this._isProgressiveRenderActive = false;
    this._componentsStore?.endProgressiveRender();
  }
  static ɵfac = function FVirtualFor_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FVirtualFor)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FVirtualFor,
    selectors: [["", "fVirtualFor", "", "fVirtualForOf", ""]],
    inputs: {
      fVirtualForOf: "fVirtualForOf"
    },
    features: [ɵɵNgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FVirtualFor, [{
    type: Directive,
    args: [{
      selector: "[fVirtualFor][fVirtualForOf]",
      standalone: true
    }]
  }], null, {
    fVirtualForOf: [{
      type: Input
    }]
  });
})();
var F_VIRTUAL_FOR_PROVIDERS = [FVirtualFor];
var EFZoomDirection;
(function(EFZoomDirection2) {
  EFZoomDirection2[EFZoomDirection2["ZOOM_IN"] = 1] = "ZOOM_IN";
  EFZoomDirection2[EFZoomDirection2["ZOOM_OUT"] = -1] = "ZOOM_OUT";
})(EFZoomDirection || (EFZoomDirection = {}));
var F_ZOOM = new InjectionToken("F_ZOOM");
var FZoomBase = class {
};
var DEFAULT_WHEEL_INTENSITY_MIN = 0.1;
var DEFAULT_WHEEL_INTENSITY_MAX = 1;
var GESTURE_WHEEL_DELTA_THRESHOLD = 0.5;
var GESTURE_WHEEL_INTENSITY_DIVISOR = 60;
var GESTURE_WHEEL_INTENSITY_MAX = 0.5;
function resolveWheelDelta(event) {
  return Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
}
function normalizeWheelStep(event, delta, step) {
  return isGestureWheelEvent(event) ? normalizeGestureWheelStep(delta, step) : normalizeMouseWheelStep(delta, step);
}
function isGestureWheelEvent(event) {
  return (event.ctrlKey || event.metaKey) && event.deltaMode === WheelEvent.DOM_DELTA_PIXEL;
}
function normalizeMouseWheelStep(delta, step) {
  const intensity = Math.abs(delta) / 100;
  const normalized = clamp(intensity, DEFAULT_WHEEL_INTENSITY_MIN, DEFAULT_WHEEL_INTENSITY_MAX);
  return step * normalized;
}
function normalizeGestureWheelStep(delta, step) {
  if (Math.abs(delta) < GESTURE_WHEEL_DELTA_THRESHOLD) {
    return 0;
  }
  const intensity = Math.abs(delta) / GESTURE_WHEEL_INTENSITY_DIVISOR;
  const normalized = clamp(intensity, 0, GESTURE_WHEEL_INTENSITY_MAX);
  return step * normalized;
}
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
var FZoomDirective = class _FZoomDirective extends FZoomBase {
  _mediator = inject(FMediator);
  _injector = inject(Injector);
  _store = inject(FComponentsStore);
  _triggersListener = EventExtensions.emptyListener();
  isEnabled = input(false, ...ngDevMode ? [{
    debugName: "isEnabled",
    alias: "fZoom",
    transform: booleanAttribute
  }] : [{
    alias: "fZoom",
    transform: booleanAttribute
  }]);
  fWheelTrigger = defaultEventTrigger;
  fDblClickTrigger = defaultEventTrigger;
  minimum = 0.1;
  maximum = 4;
  step = 0.1;
  dblClickStep = 0.5;
  get _flowHost() {
    return this._store.flowHost;
  }
  get _canvas() {
    return this._store.fCanvas;
  }
  ngOnInit() {
    this._mediator.execute(new RegisterPluginInstanceRequest(INSTANCES.ZOOM, this));
  }
  ngAfterViewInit() {
    this._listenZoomEnabledChanges();
  }
  _listenZoomEnabledChanges() {
    effect(() => {
      this.isEnabled();
      untracked(() => this._listenTriggers());
    }, {
      injector: this._injector
    });
  }
  _listenTriggers() {
    if (!this._flowHost) {
      return;
    }
    this._disposeListeners();
    if (!this.isEnabled()) {
      return;
    }
    this._listen("wheel", this._onWheel, EventExtensions.activeListener());
    this._listen("dblclick", this._onDoubleClick);
    this._triggersListener = () => {
      this._unlisten("wheel", this._onWheel, EventExtensions.activeListener());
      this._unlisten("dblclick", this._onDoubleClick);
    };
  }
  _onWheel = (event) => {
    if (!isValidEventTrigger(event, this.fWheelTrigger)) {
      return;
    }
    event.preventDefault();
    const targetElement = event.target;
    if (targetElement?.closest("[fLockedContext]")) {
      return;
    }
    const delta = resolveWheelDelta(event);
    if (delta === 0) {
      return;
    }
    const step = this._normalizeWheelStep(event, delta);
    if (step === 0) {
      return;
    }
    this.setZoom(PointExtensions.initialize(event.clientX, event.clientY), step, this._calculateDirection(delta), false);
  };
  _normalizeWheelStep(event, delta) {
    return normalizeWheelStep(event, delta, this.step);
  }
  _calculateDirection(delta) {
    return delta > 0 ? EFZoomDirection.ZOOM_OUT : EFZoomDirection.ZOOM_IN;
  }
  _onDoubleClick = (event) => {
    if (!isValidEventTrigger(event, this.fDblClickTrigger)) {
      return;
    }
    event.preventDefault();
    const targetElement = event.target;
    if (isNode(targetElement) || targetElement?.closest("[fLockedContext]")) {
      return;
    }
    this.setZoom(PointExtensions.initialize(event.clientX, event.clientY), this.dblClickStep, EFZoomDirection.ZOOM_IN, true);
  };
  _getToCenterPosition(position, rect) {
    return PointExtensions.initialize(position?.x || rect.gravityCenter.x, position?.y || rect.gravityCenter.y);
  }
  zoomIn(position) {
    this._onZoomToCenter(EFZoomDirection.ZOOM_IN, position);
  }
  zoomOut(position) {
    this._onZoomToCenter(EFZoomDirection.ZOOM_OUT, position);
  }
  _onZoomToCenter(direction, position) {
    this.setZoom(this._getToCenterPosition(position, RectExtensions.fromElement(this._flowHost)), this.step, direction, false);
  }
  setZoom(position, step, direction, animated) {
    this._mediator.execute(new SetZoomRequest(position, step, direction, animated));
  }
  getZoomValue() {
    return this._canvas.transform.scale || 1;
  }
  reset() {
    this._mediator.execute(new ResetZoomRequest());
  }
  _disposeListeners() {
    this._triggersListener();
    this._triggersListener = EventExtensions.emptyListener();
  }
  ngOnDestroy() {
    this._disposeListeners();
    this._mediator.execute(new RemovePluginInstanceRequest(INSTANCES.ZOOM));
  }
  _listen(type, listener, options) {
    this._flowHost.addEventListener(type, listener, options);
  }
  _unlisten(type, listener, options) {
    this._flowHost.removeEventListener(type, listener, options);
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵFZoomDirective_BaseFactory;
    return function FZoomDirective_Factory(__ngFactoryType__) {
      return (ɵFZoomDirective_BaseFactory || (ɵFZoomDirective_BaseFactory = ɵɵgetInheritedFactory(_FZoomDirective)))(__ngFactoryType__ || _FZoomDirective);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _FZoomDirective,
    selectors: [["f-canvas", "fZoom", ""]],
    hostAttrs: [1, "f-zoom", "f-component"],
    inputs: {
      isEnabled: [1, "fZoom", "isEnabled"],
      fWheelTrigger: "fWheelTrigger",
      fDblClickTrigger: "fDblClickTrigger",
      minimum: [2, "fZoomMinimum", "minimum", numberAttribute],
      maximum: [2, "fZoomMaximum", "maximum", numberAttribute],
      step: [2, "fZoomStep", "step", numberAttribute],
      dblClickStep: [2, "fZoomDblClickStep", "dblClickStep", numberAttribute]
    },
    features: [ɵɵProvidersFeature([{
      provide: F_ZOOM,
      useExisting: _FZoomDirective
    }]), ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FZoomDirective, [{
    type: Directive,
    args: [{
      selector: "f-canvas[fZoom]",
      standalone: true,
      host: {
        "class": "f-zoom f-component"
      },
      providers: [{
        provide: F_ZOOM,
        useExisting: FZoomDirective
      }]
    }]
  }], null, {
    isEnabled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "fZoom",
        required: false
      }]
    }],
    fWheelTrigger: [{
      type: Input
    }],
    fDblClickTrigger: [{
      type: Input
    }],
    minimum: [{
      type: Input,
      args: [{
        alias: "fZoomMinimum",
        transform: numberAttribute
      }]
    }],
    maximum: [{
      type: Input,
      args: [{
        alias: "fZoomMaximum",
        transform: numberAttribute
      }]
    }],
    step: [{
      type: Input,
      args: [{
        alias: "fZoomStep",
        transform: numberAttribute
      }]
    }],
    dblClickStep: [{
      type: Input,
      args: [{
        alias: "fZoomDblClickStep",
        transform: numberAttribute
      }]
    }]
  });
})();
var F_ZOOM_PROVIDERS = [FZoomDirective];
var FFlowModule = class _FFlowModule {
  static ɵfac = function FFlowModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FFlowModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _FFlowModule,
    declarations: [FConnectionDragHandleStart, FConnectionDragHandleEnd, FConnectionPath, FConnectionSelection, FConnectionMarker, FConnectionComponent, FConnectionForCreateComponent, FSnapConnectionComponent, FNodeInputDirective, FNodeOutletDirective, FNodeOutputDirective, FLineAlignmentComponent, FGroupDirective, FNodeDirective, FDragHandleDirective, FResizeHandleDirective, FRotateHandleDirective, FDragBlockerDirective, FDraggableDirective],
    imports: [FFlowComponent, FCanvasComponent, FBackgroundComponent, FRectPatternComponent, FCirclePatternComponent, FAutoPan, FZoomDirective, FExternalItem, FMinimapComponent, FMinimapCanvasDirective, FMinimapViewDirective, FMinimapFlowDirective, FSelectionArea, FMagneticLines, FMagneticRects, FConnectionContent, FConnectionMarkerCircle, FConnectionMarkerArrow, FConnectionGradient, FConnectionGradientRenderer, FConnectionWaypoints, FVirtualFor, FReflowIgnore, CommonModule],
    exports: [FFlowComponent, FCanvasComponent, FBackgroundComponent, FRectPatternComponent, FCirclePatternComponent, FAutoPan, FZoomDirective, FExternalItem, FSelectionArea, FMagneticLines, FMagneticRects, FConnectionContent, FConnectionMarkerCircle, FConnectionMarkerArrow, FConnectionGradient, FConnectionGradientRenderer, FConnectionWaypoints, FConnectionDragHandleStart, FConnectionDragHandleEnd, FConnectionPath, FConnectionSelection, FConnectionMarker, FConnectionComponent, FConnectionForCreateComponent, FSnapConnectionComponent, FNodeInputDirective, FNodeOutletDirective, FNodeOutputDirective, FLineAlignmentComponent, FMinimapComponent, FMinimapCanvasDirective, FMinimapViewDirective, FMinimapFlowDirective, FGroupDirective, FNodeDirective, FDragHandleDirective, FResizeHandleDirective, FRotateHandleDirective, FVirtualFor, FReflowIgnore, FDragBlockerDirective, FDraggableDirective]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [CommonModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FFlowModule, [{
    type: NgModule,
    args: [{
      declarations: [...F_CONNECTION_PROVIDERS, ...F_CONNECTORS_PROVIDERS, ...F_LINE_ALIGNMENT_PROVIDERS, ...F_NODE_PROVIDERS, FDragBlockerDirective, FDraggableDirective],
      imports: [...F_FLOW_PROVIDERS, ...F_CANVAS_PROVIDERS, ...F_BACKGROUND_PROVIDERS, ...F_AUTO_PAN_PROVIDERS, ...F_ZOOM_PROVIDERS, ...F_EXTERNAL_ITEM_PROVIDERS, ...F_MINIMAP_PROVIDERS, ...F_SELECTION_AREA_PROVIDERS, ...F_MAGNETIC_LINES_PROVIDERS, ...F_MAGNETIC_RECTS_PROVIDERS, ...F_CONNECTION_IMPORTS_EXPORTS, ...F_VIRTUAL_FOR_PROVIDERS, FReflowIgnore, CommonModule],
      exports: [...F_FLOW_PROVIDERS, ...F_CANVAS_PROVIDERS, ...F_BACKGROUND_PROVIDERS, ...F_AUTO_PAN_PROVIDERS, ...F_ZOOM_PROVIDERS, ...F_EXTERNAL_ITEM_PROVIDERS, ...F_SELECTION_AREA_PROVIDERS, ...F_MAGNETIC_LINES_PROVIDERS, ...F_MAGNETIC_RECTS_PROVIDERS, ...F_CONNECTION_IMPORTS_EXPORTS, ...F_CONNECTION_PROVIDERS, ...F_CONNECTORS_PROVIDERS, ...F_LINE_ALIGNMENT_PROVIDERS, ...F_MINIMAP_PROVIDERS, ...F_NODE_PROVIDERS, ...F_VIRTUAL_FOR_PROVIDERS, FReflowIgnore, FDragBlockerDirective, FDraggableDirective]
    }]
  }], null, null);
})();
export {
  AddCanvasToStore,
  AddCanvasToStoreRequest,
  AddConnectionForCreateToStore,
  AddConnectionForCreateToStoreRequest,
  AddConnectionMarkerToStore,
  AddConnectionMarkerToStoreRequest,
  AddConnectionToStore,
  AddConnectionToStoreRequest,
  AddConnectorToStore,
  AddConnectorToStoreRequest,
  AddDndToStore,
  AddDndToStoreRequest,
  AddFlowToStore,
  AddFlowToStoreRequest,
  AddNodeToStore,
  AddNodeToStoreRequest,
  AddPatternToBackground,
  AddPatternToBackgroundRequest,
  AddSnapConnectionToStore,
  AddSnapConnectionToStoreRequest,
  ApplyChildResizeConstraints,
  ApplyChildResizeConstraintsRequest,
  ApplyConnectionRender,
  ApplyConnectionRenderRequest,
  ApplyConnectionWorkerResult,
  ApplyConnectionWorkerResultRequest,
  ApplyParentResizeConstraints,
  ApplyParentResizeConstraintsRequest,
  AttachDragNodeHandlerFromSelection,
  AttachDragNodeHandlerFromSelectionRequest,
  AttachResizeConnectionDragHandlersToNode,
  AttachResizeConnectionDragHandlersToNodeRequest,
  AttachSoftParentConnectionDragHandlersToNode,
  AttachSoftParentConnectionDragHandlersToNodeRequest,
  AttachSourceConnectionDragHandlersToNode,
  AttachSourceConnectionDragHandlersToNodeRequest,
  AttachTargetConnectionDragHandlersToNode,
  AttachTargetConnectionDragHandlersToNodeRequest,
  BuildConnectionLine,
  BuildConnectionLineRequest,
  BuildConnectionWorkerBatch,
  BuildConnectionWorkerBatchRequest,
  BuildConnectionWorkerPayloadItem,
  BuildConnectionWorkerPayloadItemRequest,
  BuildDragNodeConstraints,
  BuildDragNodeConstraintsRequest,
  CALCULATABLE_SIDES,
  COMMON_PROVIDERS,
  CONNECTABLE_SIDE_EPSILON,
  CREATE_MOVE_NODE_DRAG_MODEL_FROM_SELECTION_PROVIDERS,
  CalculateAdaptiveCurveData,
  CalculateBezierCurveData,
  CalculateChangedRectFromDifference,
  CalculateChangedRectFromDifferenceRequest,
  CalculateClosestConnector,
  CalculateClosestConnectorRequest,
  CalculateConnectableSideByConnectedPositions,
  CalculateConnectableSideByConnectedPositionsRequest,
  CalculateConnectableSideByInternalPosition,
  CalculateConnectableSideByInternalPositionRequest,
  CalculateConnectionsState,
  CalculateConnectionsStateRequest,
  CalculateConnectorsConnectableSides,
  CalculateConnectorsConnectableSidesRequest,
  CalculateDirectChildrenUnionRect,
  CalculateDirectChildrenUnionRectRequest,
  CalculateFlowPointFromMinimapPoint,
  CalculateFlowPointFromMinimapPointRequest,
  CalculateFlowState,
  CalculateFlowStateRequest,
  CalculateInputConnections,
  CalculateInputConnectionsRequest,
  CalculateNodesBoundingBox,
  CalculateNodesBoundingBoxNormalizedPosition,
  CalculateNodesBoundingBoxNormalizedPositionRequest,
  CalculateNodesBoundingBoxRequest,
  CalculateNodesState,
  CalculateNodesStateRequest,
  CalculateOutputConnections,
  CalculateOutputConnectionsRequest,
  CalculateResizeLimits,
  CalculateResizeLimitsRequest,
  CalculateSegmentLineData,
  CalculateSelectableItems,
  CalculateSelectableItemsRequest,
  CalculateSourceConnectorsToConnect,
  CalculateSourceConnectorsToConnectRequest,
  CalculateStraightLineData,
  CalculateTargetConnectorsToConnect,
  CalculateTargetConnectorsToConnectRequest,
  CenterBasedDeltaCalculator,
  CenterGroupOrNode,
  CenterGroupOrNodeRequest,
  CenterOfMassSelectionStrategy,
  ChainPushCollisionResolver,
  ClearSelection,
  ClearSelectionRequest,
  CompleteConnectionRedraw,
  CompleteConnectionRedrawRequest,
  ConnectedSubgraphScopeFilter,
  ConnectionBehaviourBuilder,
  ConnectionBehaviourBuilderRequest,
  ConnectionContentLayoutEngine,
  ConnectionLineBuilder,
  ConnectionLineBuilderRequest,
  ConnectionRedrawState,
  ConnectionWorkerState,
  CreateConnectionCreateDragHandler,
  CreateConnectionCreateDragHandlerRequest,
  CreateConnectionFinalize,
  CreateConnectionFinalizeRequest,
  CreateConnectionFromOutletPreparation,
  CreateConnectionFromOutletPreparationRequest,
  CreateConnectionFromOutputPreparation,
  CreateConnectionFromOutputPreparationRequest,
  CreateConnectionHandler,
  CreateConnectionMarkers,
  CreateConnectionMarkersRequest,
  CreateConnectionPreparation,
  CreateConnectionPreparationRequest,
  CreateDragNodeHandler,
  CreateDragNodeHandlerRequest,
  CreateDragNodeHierarchy,
  CreateDragNodeHierarchyRequest,
  DRAG_AND_DROP_COMMON_PROVIDERS,
  DRAG_AUTO_PAN_PROVIDERS,
  DRAG_CANVAS_PROVIDERS,
  DRAG_CONNECTIONS_PROVIDERS,
  DRAG_DROP_TO_GROUP_PROVIDERS,
  DRAG_EXTERNAL_ITEM_HANDLER_KIND,
  DRAG_EXTERNAL_ITEM_HANDLER_TYPE,
  DRAG_EXTERNAL_ITEM_PROVIDERS,
  DRAG_MINIMAP_HANDLER_KIND,
  DRAG_MINIMAP_HANDLER_TYPE,
  DRAG_MINIMAP_PROVIDERS,
  DRAG_NODE_HANDLER_KIND,
  DRAG_NODE_HANDLER_TYPE,
  DRAG_SELECTION_AREA_PROVIDERS,
  DRAG_SELECT_BY_POINTER_PROVIDERS,
  DeltaClamp,
  Deprecated,
  DetectConnectionsUnderDragNode,
  DetectConnectionsUnderDragNodeRequest,
  DisableConnectionWorker,
  DisableConnectionWorkerRequest,
  DownstreamConnectionsSelectionStrategy,
  DragAndDropBase,
  DragCanvasFinalize,
  DragCanvasFinalizeRequest,
  DragCanvasHandler,
  DragCanvasPreparation,
  DragCanvasPreparationRequest,
  DragConnectionWaypointFinalize,
  DragConnectionWaypointFinalizeRequest,
  DragConnectionWaypointHandler,
  DragConnectionWaypointPreparation,
  DragConnectionWaypointPreparationRequest,
  DragExternalItemCreatePlaceholder,
  DragExternalItemCreatePlaceholderRequest,
  DragExternalItemCreatePreview,
  DragExternalItemCreatePreviewRequest,
  DragExternalItemFinalize,
  DragExternalItemFinalizeRequest,
  DragExternalItemHandler,
  DragExternalItemPreparation,
  DragExternalItemPreparationRequest,
  DragHandlerBase,
  DragHandlerInjector,
  DragMinimapFinalize,
  DragMinimapFinalizeRequest,
  DragMinimapHandler,
  DragMinimapPreparation,
  DragMinimapPreparationRequest,
  DragNodeConnectionBothSidesHandler,
  DragNodeConnectionHandlerBase,
  DragNodeConnectionSourceHandler,
  DragNodeConnectionTargetHandler,
  DragNodeDeltaConstraints,
  DragNodeFinalize,
  DragNodeFinalizeRequest,
  DragNodeHandler,
  DragNodeHierarchy,
  DragNodeItemHandler,
  DragNodePreparation,
  DragNodePreparationRequest,
  DropToGroupFinalize,
  DropToGroupFinalizeRequest,
  DropToGroupHandler,
  DropToGroupPreparation,
  DropToGroupPreparationRequest,
  ECanvasRedrawContext,
  EFCanvasLayer,
  EFConnectableSide,
  EFConnectionBehavior,
  EFConnectionConnectableSide,
  EFConnectionType,
  EFFlowFeatureKind,
  EFLayoutDirection,
  EFLayoutMode,
  EFMarkerType,
  EFReflowAxis,
  EFReflowCollision,
  EFReflowDeltaSource,
  EFReflowMode,
  EFReflowScope,
  EFResizeHandleType,
  EFZoomDirection,
  EMPTY_REFLOW_PLAN,
  EdgeBasedDeltaCalculator,
  EmitConnectionsChanges,
  EmitConnectionsChangesRequest,
  EmitEndDragSequenceEvent,
  EmitEndDragSequenceEventRequest,
  EmitSelectionChangeEvent,
  EmitSelectionChangeEventRequest,
  EmitStartDragSequenceEvent,
  EmitStartDragSequenceEventRequest,
  EnsureConnectionWorker,
  EnsureConnectionWorkerRequest,
  EventExtensions,
  ExternalRectConstraint,
  FAutoPan,
  FAutoPanBase,
  FBackgroundBase,
  FBackgroundComponent,
  FCache,
  FCacheConnector,
  FCacheConnectorKeyFactory,
  FCacheNode,
  FCanvasBase,
  FCanvasChangeEvent,
  FCanvasComponent,
  FChannel,
  FChannelHub,
  FCirclePatternComponent,
  FComponentsStore,
  FConnectionBase,
  FConnectionComponent,
  FConnectionComponentsParent,
  FConnectionContent,
  FConnectionContentBase,
  FConnectionDragHandleBase,
  FConnectionDragHandleEnd,
  FConnectionDragHandleStart,
  FConnectionForCreateComponent,
  FConnectionGradient,
  FConnectionGradientBase,
  FConnectionGradientRenderer,
  FConnectionGradientRendererBase,
  FConnectionMarker,
  FConnectionMarkerArrow,
  FConnectionMarkerBase,
  FConnectionMarkerCircle,
  FConnectionMarkerRegistry,
  FConnectionPath,
  FConnectionPathBase,
  FConnectionRegistry,
  FConnectionSelection,
  FConnectionSelectionBase,
  FConnectionWaypoints,
  FConnectionWaypointsBase,
  FConnectionWaypointsChangedEvent,
  FConnectorBase,
  FConnectorRegistry,
  FCreateConnectionEvent,
  FCreateNodeEvent,
  FDragBlockerDirective,
  FDragExternalItemStartEventData,
  FDragHandleDirective,
  FDragHandlerResult,
  FDragNodeStartEventData,
  FDragStartedEvent,
  FDraggableBase,
  FDraggableDataContext,
  FDraggableDirective,
  FDropToGroupEvent,
  FExternalItem,
  FExternalItemBase,
  FExternalItemPlaceholder,
  FExternalItemPreview,
  FExternalItemService,
  FFlowBase,
  FFlowComponent,
  FFlowModule,
  FGroupDirective,
  FIdRegistryBase,
  FLayoutController,
  FLayoutEngine,
  FLineAlignmentComponent,
  FMagneticLines,
  FMagneticLinesBase,
  FMagneticRects,
  FMagneticRectsBase,
  FMinimapBase,
  FMinimapCanvasDirective,
  FMinimapComponent,
  FMinimapFlowDirective,
  FMinimapState,
  FMinimapViewDirective,
  FMoveNodesEvent,
  FNodeBase,
  FNodeConnectionsIntersectionEvent,
  FNodeDirective,
  FNodeInputBase,
  FNodeInputDirective,
  FNodeIntersectedWithConnections,
  FNodeOutletBase,
  FNodeOutletDirective,
  FNodeOutputBase,
  FNodeOutputDirective,
  FNodeRegistry,
  FReassignConnectionEvent,
  FRectPatternComponent,
  FReflowBaselineTracker,
  FReflowController,
  FReflowCycleGuard,
  FReflowIgnore,
  FReflowIgnoreRegistry,
  FReflowOrchestrator,
  FReflowPlanner,
  FResizeChannel,
  FResizeHandleDirective,
  FResizeNodeStartEventData,
  FRotateHandleDirective,
  FRotateNodeStartEventData,
  FSelectionArea,
  FSelectionAreaBase,
  FSelectionChangeEvent,
  FSingleRegistryBase,
  FSnapConnectionComponent,
  FSourceConnectorBase,
  FVirtualFor,
  FZoomBase,
  FZoomDirective,
  F_AUTO_PAN_PROVIDERS,
  F_BACKGROUND,
  F_BACKGROUND_FEATURES,
  F_BACKGROUND_PATTERN,
  F_BACKGROUND_PROVIDERS,
  F_CACHE_FEATURES,
  F_CACHE_OPTIONS,
  F_CANVAS,
  F_CANVAS_CONFIG,
  F_CANVAS_FEATURES,
  F_CANVAS_PROVIDERS,
  F_CONNECTION_BUILDERS,
  F_CONNECTION_COMPONENTS_PARENT,
  F_CONNECTION_CONTENT,
  F_CONNECTION_DRAG_HANDLE_END,
  F_CONNECTION_DRAG_HANDLE_START,
  F_CONNECTION_FEATURES,
  F_CONNECTION_GRADIENT,
  F_CONNECTION_IMPORTS_EXPORTS,
  F_CONNECTION_MARKER,
  F_CONNECTION_PATH,
  F_CONNECTION_PROVIDERS,
  F_CONNECTION_SELECTION,
  F_CONNECTION_WAYPOINTS,
  F_CONNECTORS_FEATURES,
  F_CONNECTORS_PROVIDERS,
  F_CSS_CLASS,
  F_DEFAULT_LAYER_ORDER,
  F_DRAGGABLE_FEATURES,
  F_DRAGGABLE_PROVIDERS,
  F_EXTERNAL_ITEM,
  F_EXTERNAL_ITEM_PROVIDERS,
  F_FLOW,
  F_FLOW_CONFIG,
  F_FLOW_FEATURES,
  F_FLOW_PROVIDERS,
  F_LAYOUT,
  F_LAYOUT_OPTIONS,
  F_LINE_ALIGNMENT_PROVIDERS,
  F_MAGNETIC_LINES,
  F_MAGNETIC_LINES_PROVIDERS,
  F_MAGNETIC_RECTS,
  F_MAGNETIC_RECTS_PROVIDERS,
  F_MINIMAP_BASE,
  F_MINIMAP_FEATURES,
  F_MINIMAP_PROVIDERS,
  F_NODE,
  F_NODE_FEATURES,
  F_NODE_INPUT,
  F_NODE_OUTLET,
  F_NODE_OUTPUT,
  F_NODE_PROVIDERS,
  F_REFLOW_CONFIG,
  F_REFLOW_PROVIDERS,
  F_SELECTED_CLASS,
  F_SELECTION_AREA_PROVIDERS,
  F_SELECTION_FEATURES,
  F_STORAGE_PROVIDERS,
  F_VIRTUAL_FOR_PROVIDERS,
  F_ZOOM,
  F_ZOOM_FEATURES,
  F_ZOOM_PROVIDERS,
  FindConnectableConnectorUsingPriorityAndPosition,
  FindConnectableConnectorUsingPriorityAndPositionRequest,
  FitToChildNodesAndGroups,
  FitToChildNodesAndGroupsRequest,
  FitToFlow,
  FitToFlowRequest,
  GET_FLOW_STATE_PROVIDERS,
  GetCachedFCacheRect,
  GetCachedFCacheRectRequest,
  GetChildNodeIds,
  GetChildNodeIdsRequest,
  GetConnectorRectReference,
  GetConnectorRectReferenceRequest,
  GetCurrentSelection,
  GetCurrentSelectionRequest,
  GetDeepChildrenNodesAndGroups,
  GetDeepChildrenNodesAndGroupsRequest,
  GetFlow,
  GetFlowRequest,
  GetNodePadding,
  GetNodePaddingRequest,
  GetNormalizedConnectorRect,
  GetNormalizedConnectorRectRequest,
  GetNormalizedElementRect,
  GetNormalizedElementRectRequest,
  GetNormalizedParentNodeRect,
  GetNormalizedParentNodeRectRequest,
  GetNormalizedPoint,
  GetNormalizedPointRequest,
  GetParentNodes,
  GetParentNodesRequest,
  GlobalScopeFilter,
  GridSnapper,
  GroupScopeFilter,
  HandleConnectionWorkerMessage,
  HandleConnectionWorkerMessageRequest,
  IMouseEvent,
  INSTANCES,
  IPointerEvent,
  IPointerUpEvent,
  ITouchDownEvent,
  ITouchMoveEvent,
  InitializeDragSequence,
  InitializeDragSequenceRequest,
  InputCanvasPosition,
  InputCanvasPositionRequest,
  InputCanvasScale,
  InputCanvasScaleRequest,
  InvalidateFCacheNode,
  InvalidateFCacheNodeRequest,
  IsArrayHasParentNode,
  IsArrayHasParentNodeRequest,
  IsConnectionRedrawCurrent,
  IsConnectionRedrawCurrentRequest,
  IsConnectionWorkerEnabled,
  IsConnectionWorkerEnabledRequest,
  IsDragStarted,
  IsDragStartedRequest,
  ListenConnectionsChanges,
  ListenConnectionsChangesRequest,
  ListenNodesChanges,
  ListenNodesChangesRequest,
  ListenTransformChanges,
  ListenTransformChangesRequest,
  LogExecutionTime,
  MOUSE_EVENT_IGNORE_TIME,
  MagneticLineElement,
  MagneticLineRenderer,
  MagneticLinesHandler,
  MagneticLinesPreparation,
  MagneticLinesPreparationRequest,
  MagneticRectElement,
  MagneticRectsHandler,
  MagneticRectsPreparation,
  MagneticRectsPreparationRequest,
  MagneticRectsRenderer,
  MarkConnectableConnectors,
  MarkConnectableConnectorsRequest,
  MarkConnectionConnectorsAsConnected,
  MarkConnectionConnectorsAsConnectedRequest,
  MinimapCalculateViewRect,
  MinimapCalculateViewRectRequest,
  MinimapCalculateViewport,
  MinimapCalculateViewportRequest,
  MinimapDrawNodes,
  MinimapDrawNodesRequest,
  MoveFrontElementsBeforeTargetElement,
  MoveFrontElementsBeforeTargetElementRequest,
  NODE_PROVIDERS,
  NODE_RESIZE_PROVIDERS,
  NODE_ROTATE_PROVIDERS,
  NotifyFullRendered,
  NotifyFullRenderedRequest,
  NotifyNodesRendered,
  NotifyNodesRenderedRequest,
  NotifyTransformChanged,
  NotifyTransformChangedRequest,
  OnPointerMove,
  OnPointerMoveRequest,
  PINCH_TO_ZOOM_PROVIDERS,
  PinchToZoomFinalize,
  PinchToZoomFinalizeRequest,
  PinchToZoomHandler,
  PinchToZoomPreparation,
  PinchToZoomPreparationRequest,
  Polyline,
  PolylineContentAlign,
  PolylineContentPlace,
  PolylineSampler,
  PrepareDragSequence,
  PrepareDragSequenceRequest,
  PreventDefaultIsExternalItem,
  PreventDefaultIsExternalItemRequest,
  QueueConnectionRedraw,
  QueueConnectionRedrawRequest,
  QueueConnectionRedrawState,
  RESIZE_DIRECTIONS,
  RESIZE_NODE_HANDLER_KIND,
  RESIZE_NODE_HANDLER_TYPE,
  ROTATE_NODE_HANDLER_KIND,
  ROTATE_NODE_HANDLER_TYPE,
  ReadNodeBoundsWithPaddings,
  ReadNodeBoundsWithPaddingsRequest,
  ReadNodeBoundsWithPaddingsResponse,
  ReassignConnectionFinalize,
  ReassignConnectionFinalizeRequest,
  ReassignConnectionHandler,
  ReassignConnectionPreparation,
  ReassignConnectionPreparationRequest,
  ReassignConnectionSourceHandler,
  ReassignConnectionTargetHandler,
  RedrawCanvasWithAnimation,
  RedrawCanvasWithAnimationRequest,
  RedrawConnections,
  RedrawConnectionsRequest,
  RegisterFCacheConnector,
  RegisterFCacheConnectorRequest,
  RegisterFCacheNode,
  RegisterFCacheNodeRequest,
  RegisterPluginInstance,
  RegisterPluginInstanceRequest,
  RemoveCanvasFromStore,
  RemoveCanvasFromStoreRequest,
  RemoveConnectionForCreateFromStore,
  RemoveConnectionForCreateFromStoreRequest,
  RemoveConnectionFromStore,
  RemoveConnectionFromStoreRequest,
  RemoveConnectionMarkerFromStore,
  RemoveConnectionMarkerFromStoreRequest,
  RemoveConnectionWaypoint,
  RemoveConnectionWaypointRequest,
  RemoveConnectorFromStore,
  RemoveConnectorFromStoreRequest,
  RemoveDndFromStore,
  RemoveDndFromStoreRequest,
  RemoveFlowFromStore,
  RemoveFlowFromStoreRequest,
  RemoveNodeFromStore,
  RemoveNodeFromStoreRequest,
  RemovePluginInstance,
  RemovePluginInstanceRequest,
  RemoveSnapConnectionFromStore,
  RemoveSnapConnectionFromStoreRequest,
  RenderConnection,
  RenderConnectionFromGeometry,
  RenderConnectionFromGeometryRequest,
  RenderConnectionRequest,
  RenderConnectionWithLine,
  RenderConnectionWithLineRequest,
  RenderLifecycleState,
  ResetConnectionWorkerRuntime,
  ResetConnectionWorkerRuntimeRequest,
  ResetRenderLifecycle,
  ResetRenderLifecycleRequest,
  ResetScale,
  ResetScaleAndCenter,
  ResetScaleAndCenterRequest,
  ResetScaleRequest,
  ResetZoom,
  ResetZoomRequest,
  ResizeNodeConnectionBothSidesHandler,
  ResizeNodeConnectionHandlerBase,
  ResizeNodeConnectionSourceHandler,
  ResizeNodeConnectionTargetHandler,
  ResizeNodeFinalize,
  ResizeNodeFinalizeRequest,
  ResizeNodeHandler,
  ResizeNodePreparation,
  ResizeNodePreparationRequest,
  ResolveConnectableOutputForOutlet,
  ResolveConnectableOutputForOutletRequest,
  ResolveConnectionEndpointRect,
  ResolveConnectionEndpointRectRequest,
  ResolveConnectionEndpointRotationContext,
  ResolveConnectionEndpointRotationContextRequest,
  ResolveConnectionEndpoints,
  ResolveConnectionEndpointsRequest,
  ResolveConnectionGeometry,
  ResolveConnectionGeometryRequest,
  RotateNodeFinalize,
  RotateNodeFinalizeRequest,
  RotateNodeHandler,
  RotateNodePreparation,
  RotateNodePreparationRequest,
  RunAutoPanFrame,
  RunAutoPanFrameRequest,
  RunConnectionRedrawSlice,
  RunConnectionRedrawSliceRequest,
  RunConnectionWorker,
  RunConnectionWorkerBatch,
  RunConnectionWorkerBatchRequest,
  RunConnectionWorkerRequest,
  ScheduleAutoPanFrame,
  ScheduleAutoPanFrameRequest,
  Select,
  SelectAll,
  SelectAllRequest,
  SelectAndUpdateNodeLayer,
  SelectAndUpdateNodeLayerRequest,
  SelectByPointer,
  SelectByPointerRequest,
  SelectRequest,
  SelectionAreaFinalize,
  SelectionAreaFinalizeRequest,
  SelectionAreaHandler,
  SelectionAreaPreparation,
  SelectionAreaPreparationRequest,
  SetBackgroundTransform,
  SetBackgroundTransformRequest,
  SetFCacheConnectorRect,
  SetFCacheConnectorRectRequest,
  SetFCacheNodeRect,
  SetFCacheNodeRectRequest,
  SetZoom,
  SetZoomRequest,
  ShouldUseConnectionWorker,
  ShouldUseConnectionWorkerRequest,
  SortDropCandidatesByLayer,
  SortDropCandidatesByLayerRequest,
  SortItemLayers,
  SortItemLayersRequest,
  SortItemsByParent,
  SortItemsByParentRequest,
  SortNodeLayers,
  SortNodeLayersRequest,
  StartConnectionRedraw,
  StartConnectionRedrawRequest,
  StartConnectionWorkerRedraw,
  StartConnectionWorkerRedrawRequest,
  StopAutoPan,
  StopAutoPanRequest,
  StopCollisionResolver,
  UnmarkConnectableConnectors,
  UnmarkConnectableConnectorsRequest,
  UnregisterFCacheConnector,
  UnregisterFCacheConnectorRequest,
  UnregisterFCacheNode,
  UnregisterFCacheNodeRequest,
  UpdateFCacheRectByElement,
  UpdateFCacheRectByElementRequest,
  UpdateItemAndChildrenLayers,
  UpdateItemAndChildrenLayersRequest,
  UpdateNodeWhenStateOrSizeChanged,
  UpdateNodeWhenStateOrSizeChangedRequest,
  UpdateScale,
  UpdateScaleRequest,
  WaitForConnectionsRendered,
  WaitForConnectionsRenderedRequest,
  XRangeSelectionStrategy,
  afterNextPaint,
  buildConnectionAnchors,
  buildCornerMidPointsAndApplyOffsets,
  calculateAutoPanAxisDelta,
  calculateAutoPanDelta,
  calculateCenterBetweenPoints,
  calculateCurveCandidates,
  calculateDifferenceAfterRotation,
  calculateMagneticGuides,
  calculateMagneticRects,
  calculatePointerInFlow,
  calculatePolylineCandidates,
  calculatePositionAfterRotation,
  coerceMarkerType,
  computeEdgeDeltas,
  createConnectionDomIdentifier,
  createConnectionSelectionDomIdentifier,
  createConnectionWorkerUrl,
  createGradientDomIdentifier,
  createGradientDomUrl,
  createMultiCubicPath,
  createSVGElement,
  createSegmentLinePath,
  cubicBezierAtT,
  debounceAnimationFrame,
  debounceMicrotask,
  debounceTime,
  defaultEventTrigger,
  determineSide,
  expandRectByOverflow,
  fInstanceKey,
  fProvideCache,
  findExistingWaypoint,
  findWaypointCandidate,
  fixedCenterBehavior,
  fixedOutboundBehavior,
  floatingBehavior,
  getExternalItemHost,
  infinityMinMax,
  isCalculateMode,
  isConnectionWorkerRuntimeSupported,
  isDragBlocker,
  isDragExternalItemHandler,
  isDragHandleEnd,
  isDragHandleStart,
  isDragMinimapHandler,
  isDragNodeHandler,
  isExternalItem,
  isMobile,
  isNode,
  isNodeOutlet,
  isNodeOutput,
  isPointerInsidePoint,
  isPointerInsideStartOrEndDragHandles,
  isResizeNodeHandler,
  isRotateHandle,
  isRotateNodeHandler,
  isValidEventTrigger,
  mergeFCanvasConfig,
  mergeLayoutNodes,
  mergePointChains,
  mergeReflowConfig,
  mixinChangeSelection,
  mixinChangeVisibility,
  normalizeFlowLayoutData,
  normalizePolyline,
  notifyOnStart,
  pickWaypoint,
  provideFFlow,
  provideFLayout,
  rebaseAutoPanPointerDownPosition,
  rectFromPoint,
  resolveAutoPanMode,
  resolveConnectionWorkerRuntime,
  resolveLayerOrder,
  revokeConnectionWorkerUrl,
  sampleCubicBezierUniform,
  sampleMultiCubicUniform,
  stringAttribute,
  takeOne,
  transitionEnd,
  withFCanvas,
  withReflowOnResize,
  withinSnapThreshold
};
//# sourceMappingURL=@foblex_flow.js.map
