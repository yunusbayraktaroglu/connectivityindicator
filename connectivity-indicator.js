/**
 * CONNECTIVITY INDICATOR
 *
 * Checks internet connection with ASYNC FETCH and changes application status between
 * "ONLINE", "OFFLINE", "SOFT OFFLINE" and "RECONNECTING",
 *
 * @version : v1.0
 * @dependency : Pure JavaScript.
 *
 * @author : Yunus Bayraktaroğlu <github.com/yunusbayraktaroglu> <behance.com/yunusbayraktaroglu>
 *
 **/

"use strict";

var connectivityIndicator = function(args) {
   this.applicationState   = null;
   this.internetConnection = null;
   this.maxRetryCountDown  = args.maxRetryCountDown;
   this.autoRetryMultiple  = args.autoRetryMultiple;
   this.checkTimer         = args.checkTimer;
   this.url                = args.url;
   this.domNode = document.getElementById(args.containerID);
   this.chidren = {
      notice      : this.domNode.querySelector("#notice"),
      countDown   : this.domNode.querySelector("#count_down"),
      retryButton : this.domNode.querySelector("#retry_button"),
      cancelButton: this.domNode.querySelector("#cancel_button")
   };
   this.domNode = null;
   delete this.domNode;
   this.reConnect();
};

connectivityIndicator.prototype = {
   reConnect: function(retryButton) {
      var _root = this;
      if ( retryButton && !this.ready ) return;
      this.applicationState = "RECONNECTING";
      this.chidren.notice.innerHTML = "Retrying...";
      this.ready = false;
      this.checkConnectivity(false,function(network){
         if ( _root.internetConnection != network ) {
            _root.internetConnection = network;
            _root.connectionChange();
         } else {
            _root.offline(retryButton);
         }
         _root.ready = true;
      });
   },
   connectionChange: function() {
      var _root = this;
      switch ( this.internetConnection ) {

         case true:
            this.applicationState = "ONLINE";
            this.chidren.notice.innerHTML = "Connected!";
            this.chidren.countDown.innerHTML = "";
            this.chidren.retryButton.classList.remove("show");
            this.chidren.cancelButton.classList.remove("show");
            if ( this.cancelled ) this.cancelled = false;

            clearInterval(this.intervalID);
            clearTimeout(this.timeoutID);
            setTimeout( function() {
               _root.chidren.notice.innerHTML = "";
            }, 2000);
            setTimeout( function(){
               _root.checkConnectivity(true,function(network){
                  if ( _root.internetConnection != network ) {
                     _root.internetConnection = network;
                     _root.connectionChange();
                  }
               });
            }, this.checkTimer);
            break;

         case false:
            this.applicationState = "SOFT OFFLINE";
            this.chidren.notice.innerHTML = "";
            this.countDownTimer = this.autoRetryMultiple;
            this.countDown();
            break;
      }
   },
   offline: function(retryButton) {
      this.applicationState = "OFFLINE";
      if ( this.cancelled ) { this.chidren.notice.innerHTML = ""; return; }
      this.chidren.notice.innerHTML = "Retrying in";
      if ( retryButton ) return;
      this.chidren.retryButton.innerHTML = "Retry Now";
      this.chidren.retryButton.classList.add("show");
      this.chidren.cancelButton.classList.add("show");
      this.countDownTimer += this.countDownTimer;
      this.countDown();
   },
   countDown: function() {
      var _root = this;
      if( this.countDownTimer > this.maxRetryCountDown ) return this.stopConnect();
      this.countFrom = this.countDownTimer;
      this.chidren.countDown.innerHTML = this.countFrom;

      this.intervalID = setInterval( function() {
         _root.countFrom -= 1;
         _root.chidren.countDown.innerHTML = _root.countFrom;
      }, 1000);
      this.timeoutID = setTimeout( function() {
         clearInterval(_root.intervalID);
         _root.chidren.countDown.innerHTML = "";
         _root.reConnect();
      }, this.countFrom * 1000 );
   },
   stopConnect: function() {
      this.chidren.countDown.innerHTML = "";
      this.chidren.notice.innerHTML = "";
      this.chidren.retryButton.innerHTML = "Retry";
      this.chidren.cancelButton.classList.remove("show");
      this.cancelled = true;
      clearInterval(this.intervalID);
      clearTimeout(this.timeoutID);
   }
};

connectivityIndicator.prototype.checkConnectivity = function(auto,network) {
   var _root = this;
   fetch(this.url, {mode: "no-cors",cache: "no-store"} )
      .then(function() {
         network(true);
         console.log("true");
         if ( auto ) {
            setTimeout(function(){
               _root.checkConnectivity(true,network);
            }, _root.checkTimer);
         }
      })
      .catch(function() {
         network(false);
         console.log("false");
      });
};