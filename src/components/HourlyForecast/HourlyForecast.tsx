import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { focusDay, selectHour } from "../../store/weatherSlice";
import { WeatherCard } from "../WeatherCard/WeatherCard";
import styles from "./HourlyForecast.module.scss";

// pointer must travel this far before a press counts as a drag, not a click
const DRAG_THRESHOLD = 6;

export const HourlyForecast = () => {
  const dispatch = useAppDispatch();
  const hourly = useAppSelector((state) => state.weather.hourly);
  const forecastError = useAppSelector((state) => state.weather.forecastError);
  const selectedHour = useAppSelector((state) => state.weather.selectedHour);
  const scrollTarget = useAppSelector((state) => state.weather.scrollTarget);

  const stripRef = useRef<HTMLDivElement>(null);
  const focusedRef = useRef<string | null>(null);
  const programmaticUntil = useRef(0);
  const drag = useRef({ active: false, moved: false, startX: 0, startLeft: 0 });

  const [isDragging, setIsDragging] = useState(false);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  // work out which day the row is showing and whether there is more to scroll to
  const handleScroll = useCallback(() => {
    const strip = stripRef.current;

    if (!strip) {
      return;
    }

    setCanScroll({
      left: strip.scrollLeft > 4,
      right: strip.scrollLeft + strip.clientWidth < strip.scrollWidth - 4,
    });

    // while a click on a day is scrolling the row, leave the highlight on that day
    if (performance.now() < programmaticUntil.current) {
      return;
    }

    const stripLeft = strip.getBoundingClientRect().left;
    const items = strip.querySelectorAll<HTMLElement>("[data-day]");

    for (const item of items) {
      const rect = item.getBoundingClientRect();

      // first card that is at least half visible from the left edge
      if (rect.right - stripLeft > rect.width / 2) {
        const day = item.dataset.day;

        if (day && day !== focusedRef.current) {
          focusedRef.current = day;
          dispatch(focusDay(day));
        }

        return;
      }
    }
  }, [dispatch]);

  useEffect(() => {
    const strip = stripRef.current;

    if (!strip) {
      return;
    }

    handleScroll();

    const observer = new ResizeObserver(handleScroll);

    observer.observe(strip);

    return () => observer.disconnect();
  }, [handleScroll, hourly.length]);

  // a click on a day in the daily list asks us to scroll to its first hour
  useEffect(() => {
    const strip = stripRef.current;

    if (!scrollTarget || !strip) {
      return;
    }

    const first = strip.querySelector<HTMLElement>(
      `[data-day="${scrollTarget.day}"]`,
    );

    if (!first) {
      return;
    }

    focusedRef.current = scrollTarget.day;
    programmaticUntil.current = performance.now() + 700;
    strip.scrollTo({
      left: first.offsetLeft - 8,
      behavior: "smooth",
    });
  }, [scrollTarget]);

  const scrollByPage = (direction: 1 | -1) => {
    stripRef.current?.scrollBy({
      left: direction * stripRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  // mouse drag-to-scroll (touch and trackpads already scroll natively)
  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) {
      return;
    }

    drag.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startLeft: event.currentTarget.scrollLeft,
    };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;

    if (!state.active) {
      return;
    }

    const delta = event.clientX - state.startX;

    if (!state.moved && Math.abs(delta) > DRAG_THRESHOLD) {
      state.moved = true;
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    if (state.moved) {
      event.currentTarget.scrollLeft = state.startLeft - delta;
    }
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (drag.current.moved && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    drag.current.active = false;
    setIsDragging(false);
  };

  // the click that ends a drag must not select the card under the pointer
  const swallowClickAfterDrag = (event: React.MouseEvent) => {
    if (drag.current.moved) {
      event.stopPropagation();
      event.preventDefault();
      drag.current.moved = false;
    }
  };

  const fadeLeft = canScroll.left ? "28px" : "0px";
  const fadeRight = canScroll.right ? "28px" : "0px";

  return (
    <section className={styles.card} aria-label="Hourly forecast">
      <h2 className={styles.title}>Hourly</h2>
      <div className={styles.stripWrap}>
        {canScroll.left && (
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowLeft}`}
            aria-label="Earlier hours"
            onClick={() => scrollByPage(-1)}
          >
            ‹
          </button>
        )}
        <div
          ref={stripRef}
          className={`${styles.strip} ${isDragging ? styles.stripDragging : ""}`}
          style={
            {
              "--fade-left": fadeLeft,
              "--fade-right": fadeRight,
            } as React.CSSProperties
          }
          onScroll={handleScroll}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={swallowClickAfterDrag}
        >
          {forecastError ? (
            <WeatherCard type="hourly" state="error" />
          ) : (
            hourly.map((item, index) => {
              // the first card is "Now" (real current weather); the rest are forecast hours
              const value = index === 0 ? null : index;
              const isSelected = selectedHour === value;

              return (
                <Fragment key={`${item.dayKey}-${item.currentTime}`}>
                  {index > 0 && hourly[index - 1].dayKey !== item.dayKey && (
                    <div className={styles.divider}>
                      <span className={styles.dividerLabel}>
                        {item.dayName.slice(0, 3)}
                      </span>
                      <span className={styles.dividerLine} />
                    </div>
                  )}
                  <button
                    type="button"
                    className={styles.item}
                    data-day={item.dayKey}
                    aria-pressed={isSelected}
                    aria-label={`${index === 0 ? "Now" : `${item.dayName} ${item.currentTime}`}, show weather`}
                    onClick={() => dispatch(selectHour(value))}
                  >
                    <WeatherCard
                      type="hourly"
                      state="default"
                      label={index === 0 ? "Now" : item.currentTime}
                      temperature={item.temperature}
                      kind={item.kind}
                      isSelected={isSelected}
                    />
                  </button>
                </Fragment>
              );
            })
          )}
        </div>
        {canScroll.right && (
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowRight}`}
            aria-label="Later hours"
            onClick={() => scrollByPage(1)}
          >
            ›
          </button>
        )}
      </div>
    </section>
  );
};
