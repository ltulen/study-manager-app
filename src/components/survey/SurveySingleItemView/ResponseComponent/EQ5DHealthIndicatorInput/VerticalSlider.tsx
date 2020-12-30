import React, { useRef, useState } from 'react';
import clsx from 'clsx';

interface VerticalSliderProps {
    value?: number;
    onChange: (value: number | undefined) => void;
    maxValueText?: string;
    minValueText?: string;
}

const tickLength = {
    major: 32,
    minor: 16
};
const tickHeight = 2;
const tickDistance = 5;

const handlerRadius = 12;
const dragAreaHeight = 120;

const getSingleTick = (major: boolean) => {
    return <div
        className={
            clsx(
                {
                    'bg-grey-7': major,
                    'bg-grey-5': !major
                })
        } style={{
            width: major ? tickLength.major : tickLength.minor,
            height: tickHeight
        }}>
    </div>
}

const getTickLabel = (value: number, isMajor: boolean) => {
    if (!isMajor) {
        return null;
    }
    return (<div className="position-absolute"
        style={{
            left: '70%'
        }}
    >
        {value.toFixed()}
    </div>)
}

const getTickItem = (index: number) => {
    const value = (100 - index);
    const isDecimal = value % 10 === 0;
    return <div
        key={index.toFixed()}
        className="d-flex justify-content-center align-items-center position-relative"
        style={{
            height: tickDistance,
            // touchAction: 'none'
        }}
    >
        {getSingleTick(isDecimal)}
        {getTickLabel(value, isDecimal)}
    </div>
}

const VerticalSlider: React.FC<VerticalSliderProps> = (props) => {
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);


    const renderTicks = () => {
        return (
            <React.Fragment>
                {Array(101).fill(0).map(
                    (_, index: number) =>
                        getTickItem(index)
                )}
            </React.Fragment>
        )
    }

    const renderHandle = () => {
        if (props.value === undefined) { return null; }

        return <React.Fragment>
            <div className="text-center d-flex justify-content-center w-100 position-absolute"
                style={{
                    top: `calc(${100 - props.value}*${tickDistance}px + 15px + ${tickDistance - tickHeight}px - ${handlerRadius}px)`
                }}
            >
                <div className="bg-primary rounded-circle"
                    style={{
                        height: handlerRadius * 2,
                        width: handlerRadius * 2,
                        touchAction: 'none'

                    }}
                ></div>
            </div>
            <div className="text-center d-flex justify-content-center w-100 position-absolute"
                style={{
                    top: `calc(${100 - props.value}*${tickDistance}px + 15px + ${tickDistance - tickHeight}px - ${dragAreaHeight / 2}px)`,
                    touchAction: 'none',
                    height: dragAreaHeight,
                }}
            >
            </div>
        </React.Fragment>
    }

    const computeNewValue = (clientY: number): number | undefined => {
        const top = sliderRef.current?.getBoundingClientRect().top;
        const height = sliderRef.current?.getBoundingClientRect().height;
        if (!top || !height) { return; }
        const value = Math.min(Math.max(1 - (clientY - top - 17) / (height - 35), 0), 1);
        return Math.round(value * 100);
    }

    const mouseHandler = (event: React.MouseEvent) => {
        const value = computeNewValue(event.clientY);
        props.onChange(value);
    }

    const downEvent = (clientY: number) => {
        const value = computeNewValue(clientY);
        if (value === undefined) { return; }
        // props.onChange(value);
        if (Math.abs((props.value !== undefined ? props.value : 50) - value) < 20) {
            setIsDragging(true)
        }
    }

    return (
        <React.Fragment>
            {props.maxValueText ?
                <p className="m-0 fw-bold no-select">
                    {props.maxValueText}
                </p>
                : null
            }

            <div className="py-2 position-relative no-select cursor-pointer"
                ref={sliderRef}
                onClick={mouseHandler}
                onMouseMove={(event) => {
                    if (isDragging && event.buttons > 0) {
                        mouseHandler(event);
                    }
                }}
                onMouseDown={(event) => {
                    downEvent(event.clientY);
                }}
                onTouchStart={(event) => {
                    downEvent(event.touches[0].clientY);
                }}
                onTouchEnd={() => setIsDragging(false)}
                onMouseUp={() => setIsDragging(false)}
                onTouchMove={(event) => {
                    event.preventDefault();
                    if (!isDragging) { return }
                    const value = computeNewValue(event.touches[0].clientY);
                    if (value === undefined) { return; }
                    props.onChange(value);
                    if (Math.abs((props.value ? props.value : 50) / 100 - value) < 0.2) {
                        setIsDragging(true)
                    }
                }}

            // onMouseLeave={() => setIsDragging(false)}
            >
                {renderTicks()}
                {renderHandle()}
            </div>

            {props.minValueText ?
                <p className="m-0 fw-bold no-select">
                    {props.minValueText}
                </p>
                : null
            }

        </React.Fragment>

    );
};

export default VerticalSlider;