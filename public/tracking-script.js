(function () {
  ("use strict");
  var location = window.location;
  var document = window.document;
  var scriptElement = document.currentScript;
  var dataDomain = scriptElement.getAttribute("data-domain");

  let queryString = location.search
  const params = new URLSearchParams(queryString)
  var source = params.get("utm")

  var endpoint = `${process.env.NEXT_PUBLIC_APP_URI}/api/track`;
  function generateSessionId() {
    return "session-" + Math.random().toString(36).substring(1, 9);
  }
  function initializeSession() {
    var sessionId = localStorage.getItem("session_id");
    var expirationTimestamp = localStorage.getItem(
      "session_expiration_timestamp"
    );
    if (!sessionId || !expirationTimestamp) {
      sessionId = generateSessionId();
      // set the expiration timestamp
      expirationTimestamp = Date.now() + 10 * 60 * 1000; // 10 mins
      localStorage.setItem("session_id", sessionId);
      localStorage.setItem("session_expiration_timestamp", expirationTimestamp);
      trackSessionStart()
    }

    return {
      sessionId: sessionId,
      expirationTimestamp: parseInt(expirationTimestamp),
    };
  }

  function isSessionExpired(expirationTimestamp) {
    return Date.now() >= expirationTimestamp;
  }

  function checkSessionStatus() {
    var session = initializeSession();
    if (isSessionExpired(session.expirationTimestamp)) {
      localStorage.removeItem("session_id");
      localStorage.removeItem("session_expiration_timestamp");
      trackSessionEnd()
      initializeSession();
    }
  }
  checkSessionStatus();

  function trigger(eventName, options) {
    var payload = {
      event: eventName,
      url: location.href,
      domain: dataDomain,
      source: source
    };
    sendRequest(payload, options);
  }

  function sendRequest(payload, options) {
    var request = new XMLHttpRequest();
    request.open("POST", endpoint, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        options && options.callback && options.callback();
      }

      request.send(JSON.stringify(payload));
    };
  }

  // Queue of tracking events

  var queue = (window.your_tracking && window.your_tracking.q) || [];
  window.your_tracking = trigger;

  for (var i = 0; i < queue.length; i++) {
    trigger.apply(this, queue[i]);
  }

  // function to track page views
  function trackPageView() {
    // Trigger a custom event indication page view
    trigger("pageview");
  }
  function trackSessionStart() {
    trigger("session_start");
  }

  function trackSessionEnd() {
    trigger("session_end");
  }

  trackPageView()

  var initialPathname = window.location.pathname

  window.addEventListener("popstate", trackPageView)
  window.addEventListener("hashchange", trackPageView)
  document.addEventListener("click", function(event) {
    setTimeout(() => {
        if(window.location.pathname !== initialPathname){
            trackPageView()
            initialPathname = window.location.pathname
        }
    },3000)
  })
});
