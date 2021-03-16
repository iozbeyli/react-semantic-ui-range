import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./range.css.js";
import ReactDOM from "react-dom";
export default class Slider extends Component {
  constructor(props) {
    super(props);
    let value = this.props.value
      ? this.props.value
      : props.multiple
      ? [...props.settings.start]
      : props.settings.start;
    this.state = {
      value: value,
      position: props.multiple ? [] : 0,
      numberOfThumbs: props.multiple ? value.length : 1,
      offset: 10,
      precision: 0,
      mouseDown: false,
    };
    this.determinePosition = this.determinePosition.bind(this);
    this.rangeMouseUp = this.rangeMouseUp.bind(this);
  }

  componentDidMount() {
    this.determinePrecision();
    const value = this.props.value ? this.props.value : this.state.value;
    this.setValuesAndPositions(value, false);
    window.addEventListener("mouseup", this.rangeMouseUp);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const isValueUnset =
      nextProps.value === null || nextProps.value === undefined;
    if (!isValueUnset && nextProps.value !== this.state.value) {
      if (this.props.multiple) {
        const different = this.isDifferentArrays(
          nextProps.value,
          this.state.value
        );
        if (different) {
          this.setValuesAndPositions(nextProps.value, true);
        }
      } else {
        this.setValuesAndPositions(nextProps.value, true);
      }
    }
  }

  componentWillUnmount() {
    this.inner = undefined;
    this.innerLeft = undefined;
    this.innerRight = undefined;
    window.removeEventListener("mouseup", this.rangeMouseUp);
  }

  setValuesAndPositions(value, triggeredByUser) {
    if (this.props.multiple) {
      const positions = [...this.state.position];
      value.forEach((val, i) => {
        this.setValue(val, triggeredByUser, i);
        positions[i] = this.determinePosition(val);
      });
      this.setState({
        position: positions,
      });
    } else {
      this.setValue(value, triggeredByUser);
      this.setState({
        position: this.determinePosition(value),
      });
    }
  }

  isDifferentArrays(a, b) {
    let different = false;
    a.some((val, i) => {
      if (val !== b[i]) {
        different = true;
        return true;
      }
    });
    return different;
  }

  determinePosition(value) {
    const trackLeft = ReactDOM.findDOMNode(this.track).getBoundingClientRect()
      .left;
    const innerLeft = ReactDOM.findDOMNode(this.inner).getBoundingClientRect()
      .left;
    const ratio =
      (value - this.props.settings.min) /
      (this.props.settings.max - this.props.settings.min);
    const position =
      Math.round(ratio * this.inner.offsetWidth) +
      trackLeft -
      innerLeft -
      this.state.offset;
    return position;
  }

  determinePrecision() {
    let split = String(this.props.settings.step).split(".");
    let decimalPlaces;
    if (split.length === 2) {
      decimalPlaces = split[1].length;
    } else {
      decimalPlaces = 0;
    }
    this.setState({
      precision: Math.pow(10, decimalPlaces),
    });
  }

  determineValue(startPos, endPos, currentPos) {
    let ratio = (currentPos - startPos) / (endPos - startPos);
    let range = this.props.settings.max - this.props.settings.min;
    let difference =
      Math.round((ratio * range) / this.props.settings.step) *
      this.props.settings.step;
    // Use precision to avoid ugly Javascript floating point rounding issues
    // (like 35 * .01 = 0.35000000000000003)
    difference =
      Math.round(difference * this.state.precision) / this.state.precision;
    return difference + this.props.settings.min;
  }

  determineThumb(position, value) {
    if (!this.props.multiple) {
      return 0;
    }
    if (position <= this.state.position[0]) {
      return 0;
    }
    if (position >= this.state.position[this.state.numberOfThumbs - 1]) {
      return this.state.numberOfThumbs - 1;
    }
    let index = 0;

    for (let i = 0; i < this.state.numberOfThumbs - 1; i++) {
      if (
        position >= this.state.position[i] &&
        position < this.state.position[i + 1]
      ) {
        const distanceToSecond = Math.abs(
          position - this.state.position[i + 1]
        );
        const distanceToFirst = Math.abs(position - this.state.position[i]);
        if (distanceToSecond <= distanceToFirst) {
          return i + 1;
        } else {
          return i;
        }
      }
    }
    return index;
  }

  setValue(value, triggeredByUser, thumbIndex) {
    if (typeof triggeredByUser === "undefined") {
      triggeredByUser = true;
    }
    const currentValue = this.props.multiple
      ? this.state.value[thumbIndex]
      : this.state.value;
    if (currentValue !== value) {
      let newValue = [];
      if (this.props.multiple) {
        newValue = [...this.state.value];
        newValue[thumbIndex] = value;
        this.setState({
          value: newValue,
        });
      } else {
        newValue = value;
        this.setState({
          value: value,
        });
      }
      if (this.props.settings.onChange) {
        this.props.settings.onChange(newValue, {
          triggeredByUser: triggeredByUser,
        });
      }
    }
  }

  setValuePosition(value, triggeredByUser, thumbIndex) {
    if (this.props.multiple) {
      const positions = [...this.state.position];
      positions[thumbIndex] = this.determinePosition(value);
      this.setValue(value, triggeredByUser, thumbIndex);
      this.setState({
        position: positions,
      });
    } else {
      this.setValue(value, triggeredByUser);
      this.setState({
        position: this.determinePosition(value),
      });
    }
  }

  setPosition(position, thumbIndex) {
    if (this.props.multiple) {
      const newPosition = [...this.state.position];
      newPosition[thumbIndex] = position;
      this.setState({
        position: newPosition,
      });
    } else {
      this.setState({
        position: position,
      });
    }
  }

  rangeMouseDown(isTouch, e) {
    e.stopPropagation();
    if (!this.props.disabled) {
      if (!isTouch) {
        e.preventDefault();
      }

      this.setState({
        mouseDown: true,
      });
      let innerBoundingClientRect = ReactDOM.findDOMNode(
        this.inner
      ).getBoundingClientRect();
      this.innerLeft = innerBoundingClientRect.left;
      this.innerRight = this.innerLeft + this.inner.offsetWidth;
      this.rangeMouse(isTouch, e);
    }
  }

  rangeMouse(isTouch, e) {
    let pageX;
    let event = isTouch ? e.touches[0] : e;
    if (event.pageX) {
      pageX = event.pageX;
    } else {
      console.log("PageX undefined");
    }
    let value = this.determineValue(this.innerLeft, this.innerRight, pageX);
    if (pageX >= this.innerLeft && pageX <= this.innerRight) {
      if (
        value >= this.props.settings.min &&
        value <= this.props.settings.max
      ) {
        const position = pageX - this.innerLeft - this.state.offset;
        const thumbIndex = this.props.multiple
          ? this.determineThumb(position)
          : undefined;
        if (this.props.discrete) {
          this.setValuePosition(value, false, thumbIndex);
        } else {
          this.setPosition(position, thumbIndex);
          this.setValue(value, undefined, thumbIndex);
        }
      }
    }
  }

  rangeMouseMove(isTouch, e) {
    e.stopPropagation();
    if (!isTouch) {
      e.preventDefault();
    }
    if (this.state.mouseDown) {
      this.rangeMouse(isTouch, e);
    }
  }

  rangeMouseUp() {
    this.setState({
      mouseDown: false,
    });
  }

  render() {
    return (
      <div>
        <div
          onMouseDown={(event) => this.rangeMouseDown(false, event)}
          onMouseMove={(event) => this.rangeMouseMove(false, event)}
          onMouseUp={(event) => this.rangeMouseUp(false, event)}
          onTouchEnd={(event) => this.rangeMouseUp(true, event)}
          onTouchMove={(event) => this.rangeMouseMove(true, event)}
          onTouchStart={(event) => this.rangeMouseDown(true, event)}
          style={{
            ...styles.range,
            ...(this.props.disabled ? styles.disabled : {}),
            ...(this.props.style ? this.props.style : {}),
          }}
        >
          <div
            className="semantic_ui_range_inner"
            ref={(inner) => {
              this.inner = inner;
            }}
            style={{
              ...styles.inner,
              ...(this.props.style
                ? this.props.style.inner
                  ? this.props.style.inner
                  : {}
                : {}),
            }}
          >
            <div
              ref={(track) => {
                this.track = track;
              }}
              style={{
                ...styles.track,
                ...(this.props.inverted ? styles.invertedTrack : {}),
                ...(this.props.style
                  ? this.props.style.track
                    ? this.props.style.track
                    : {}
                  : {}),
              }}
            />
            <div
              ref={(trackFill) => {
                this.trackFill = trackFill;
              }}
              style={{
                ...styles.trackFill,
                ...(this.props.inverted ? styles.invertedTrackFill : {}),
                ...styles[
                  this.props.inverted
                    ? "inverted-" + this.props.color
                    : this.props.color
                ],
                ...(this.props.style
                  ? this.props.style.trackFill
                    ? this.props.style.trackFill
                    : {}
                  : {}),
                ...(this.props.disabled ? styles.disabledTrackFill : {}),
                ...(this.props.style
                  ? this.props.style.disabledTrackFill
                    ? this.props.style.disabledTrackFill
                    : {}
                  : {}),
                ...{ width: this.state.position + this.state.offset + "px" },
                ...(this.props.multiple && this.state.position.length > 0
                  ? {
                      left: this.state.position[0],
                      width:
                        this.state.position[this.state.numberOfThumbs - 1] -
                        this.state.position[0],
                    }
                  : {}),
              }}
            />

            {this.props.multiple ? (
              this.state.position.map((pos, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.thumb,
                    ...(this.props.style
                      ? this.props.style.thumb
                        ? this.props.style.thumb
                        : {}
                      : {}),
                    ...{ left: pos + "px" },
                  }}
                />
              ))
            ) : (
              <div
                style={{
                  ...styles.thumb,
                  ...(this.props.style
                    ? this.props.style.thumb
                      ? this.props.style.thumb
                      : {}
                    : {}),
                  ...{ left: this.state.position + "px" },
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

Slider.defaultProps = {
  color: "red",
  settings: {
    min: 0,
    max: 10,
    step: 1,
    start: 0,
  },
};

Slider.propTypes = {
  color: PropTypes.string,
  disabled: PropTypes.bool,
  discrete: PropTypes.bool,
  inverted: PropTypes.bool,
  multiple: PropTypes.bool,
  settings: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    start: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.arrayOf(PropTypes.number),
    ]),
    onChange: PropTypes.func,
  }),
};
