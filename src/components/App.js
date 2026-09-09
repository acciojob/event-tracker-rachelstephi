import { useState } from "react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Popup from "reactjs-popup";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "reactjs-popup/dist/index.css";
import "./App.css";

const localizer = momentLocalizer(moment);

function App() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  const [filter, setFilter] = useState("all");

  const openCreatePopup = (date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setTitle("");
    setLocation("");
  };

  const openEventPopup = (event) => {
    setSelectedEvent(event);
    setTitle(event.title);
    setLocation(event.location);
  };

  const saveEvent = () => {
    if (!title.trim() || !location.trim()) {
      return;
    }

    if (selectedEvent) {
      setEvents((previousEvents) =>
        previousEvents.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                title: title.trim(),
                location: location.trim(),
              }
            : event
        )
      );

      return;
    }

    const newEvent = {
      id: Date.now(),
      title: title.trim(),
      location: location.trim(),
      start: selectedDate,
      end: moment(selectedDate).add(1, "hour").toDate(),
    };

    setEvents((previousEvents) => [...previousEvents, newEvent]);
  };

  const deleteEvent = () => {
    if (!selectedEvent) {
      return;
    }

    setEvents((previousEvents) =>
      previousEvents.filter((event) => event.id !== selectedEvent.id)
    );
  };

  const isPastEvent = (event) => {
    return moment(event.start).isBefore(moment(), "day");
  };

  const filteredEvents = events.filter((event) => {
    if (filter === "past") {
      return isPastEvent(event);
    }

    if (filter === "upcoming") {
      return !isPastEvent(event);
    }

    return true;
  });

  const eventStyleGetter = (event) => {
    const past = isPastEvent(event);

    return {
      style: {
        backgroundColor: past
          ? "rgb(222, 105, 135)"
          : "rgb(140, 189, 76)",
        border: "none",
        color: "white",
        borderRadius: "4px",
      },
    };
  };

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h1>Event Tracker</h1>

        <Popup
          trigger={
            <button className="btn create-btn">
              Create Event
            </button>
          }
          modal
          nested
          onClose={() => {
            setSelectedEvent(null);
            setSelectedDate(null);
          }}
        >
          {(close) => (
            <div className="mm-popup__box">
              <div className="popup-header">
                <h2>Create Event</h2>

                <button
                  className="popup-close"
                  onClick={close}
                >
                  ×
                </button>
              </div>

              <div className="popup-body">
                <input
                  type="text"
                  placeholder="Event Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Event Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="mm-popup__box__footer">
                <div className="mm-popup__box__footer__left-space"></div>

                <div className="mm-popup__box__footer__right-space">
                  <button
                    className="mm-popup__btn"
                    onClick={() => {
                      saveEvent();
                      close();
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </Popup>
      </div>

      <div className="filter-container">
        <button
          className={`btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={`btn ${filter === "past" ? "active" : ""}`}
          onClick={() => setFilter("past")}
        >
          Past
        </button>

        <button
          className={`btn ${filter === "upcoming" ? "active" : ""}`}
          onClick={() => setFilter("upcoming")}
        >
          Upcoming
        </button>
      </div>

      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          selectable
          views={["month"]}
          defaultView="month"
          onSelectSlot={(slotInfo) => {
            openCreatePopup(slotInfo.start);
          }}
          onSelectEvent={(event) => {
            openEventPopup(event);
          }}
          eventPropGetter={eventStyleGetter}
          tooltipAccessor={(event) =>
            `${event.title} - ${event.location}`
          }
        />
      </div>

      {selectedEvent && (
        <Popup
          open={true}
          modal
          nested
          onClose={() => {
            setSelectedEvent(null);
          }}
        >
          {(close) => (
            <div className="mm-popup__box">
              <div className="popup-header">
                <h2>Event Details</h2>

                <button
                  className="popup-close"
                  onClick={close}
                >
                  ×
                </button>
              </div>

              <div className="event-details">
                <h3>{selectedEvent.title}</h3>

                <p>
                  <strong>Location:</strong>{" "}
                  {selectedEvent.location}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {moment(selectedEvent.start).format("MMMM Do YYYY")}
                </p>
              </div>

              <div className="mm-popup__box__footer">
                <div className="mm-popup__box__footer__left-space">
                  <button
                    className="mm-popup__btn mm-popup__btn--danger"
                    onClick={() => {
                      deleteEvent();
                      close();
                    }}
                  >
                    Delete
                  </button>
                </div>

                <div className="mm-popup__box__footer__right-space">
                  <Popup
                    trigger={
                      <button className="mm-popup__btn mm-popup__btn--info">
                        Edit
                      </button>
                    }
                    modal
                    nested
                  >
                    {(editClose) => (
                      <div className="mm-popup__box">
                        <div className="popup-header">
                          <h2>Edit Event</h2>

                          <button
                            className="popup-close"
                            onClick={editClose}
                          >
                            ×
                          </button>
                        </div>

                        <div className="popup-body">
                          <input
                            type="text"
                            placeholder="Event Title"
                            value={title}
                            onChange={(e) =>
                              setTitle(e.target.value)
                            }
                          />

                          <input
                            type="text"
                            placeholder="Event Location"
                            value={location}
                            onChange={(e) =>
                              setLocation(e.target.value)
                            }
                          />
                        </div>

                        <div className="mm-popup__box__footer">
                          <div></div>

                          <div className="mm-popup__box__footer__right-space">
                            <button
                              className="mm-popup__btn"
                              onClick={() => {
                                saveEvent();
                                editClose();
                                close();
                              }}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Popup>
                </div>
              </div>
            </div>
          )}
        </Popup>
      )}
    </div>
  );
}

export default App;
