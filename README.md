# Connectivity Indicator
Checks internet connection with ASYNC FETCH and changes application status between "ONLINE", "OFFLINE", "SOFT OFFLINE" and "RECONNECTING".

```javascript
var myApp = new connectivityIndicator({
 containerID: "connectivity_indicator",
 url: "http://www.yunusbayraktaroglu.com/z.ico",
 checkTimer: 1000, //Check connectivity after X milisecond if online
 maxRetryCountDown: 1000, //If counter reach this, disable auto retry process
 autoRetryMultiple: 5 //Start count from 5 
});
```
