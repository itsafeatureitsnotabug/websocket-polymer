'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var store = void 0;
var _socketId = null;
var _socketMsg = null;
var _socketURL = null;
var MAX_MSG_HISTORY = 20;

var WebsocketsRedux = function () {
  function WebsocketsRedux() {
    _classCallCheck(this, WebsocketsRedux);
  }

  _createClass(WebsocketsRedux, [{
    key: 'beforeRegister',
    value: function beforeRegister() {
      this.is = 'ws-poly';

      this.properties = {};
    }
  }, {
    key: 'created',
    value: function created() {
      // Define All Actions 
      this.wsMessageActions = {
        sendWsMsg: function sendWsMsg(ws, wsMessage) {
          return {
            type: 'SEND_WS_MESSAGE',
            wsId: ws,
            wsMsg: wsMessage
          };
        },
        connectWs: function connectWs(ws, url) {
          return {
            type: 'CONNECT_WS',
            wsId: ws,
            wsUrl: url
          };
        },
        disconnectWs: function disconnectWs(ws) {
          return {
            type: 'DISCONNECT_WS',
            wsId: ws
          };
        }
      };
    }
  }, {
    key: 'ready',
    value: function ready() {
      var that = this;
      // Initialize  Redux  Store
      function msgReducer() {
        var state = arguments.length <= 0 || arguments[0] === undefined ? Immutable.Map({
          wsId: null,
          wsUrl: '',
          wsMsg: ''
        }) : arguments[0];
        var action = arguments[1];


        switch (action.type) {
          case 'SEND_WS_MESSAGE':
            action.wsId.send(action.wsMsg);
            return {
              wsId: action.wsId,
              wsUrl: '',
              wsMsg: action.wsMsg
            };
            break;

          case 'CONNECT_WS':
            var newSocket = new WebSocket(action.wsUrl);
            if (newSocket.readyState === 3) {
              newSocket = null;
            }
            return {
              wsId: newSocket,
              wsUrl: action.wsUrl,
              wsMsg: ''
            };
            break;

          case 'DISCONNECT_WS':
            action.wsId.close();
            return {
              wsId: null,
              wsUrl: '',
              wsMsg: ''
            };
            break;

          default:
            return state;
        }
      }

      // Define App as combination of all reducers
      var wsReduxApp = Redux.combineReducers({
        msgReducer: msgReducer
      });
      var initialState = Immutable.List.of();

      // Create Store
      store = Redux.createStore(msgReducer, initialState);

      // Subscribe Variables
      store.subscribe(function () {
        _socketId = store.getState().wsId;
        _socketMsg = store.getState().wsMsg;
        _socketURL = store.getState().wsUrl;
      });
    }
  }, {
    key: 'attached',
    value: function attached() {
      var that = this;
      // that.connectSocket();
    }
  }, {
    key: 'connectSocket',
    value: function connectSocket() {
      var that = this;
      var protocol = "ws://";
      that.updateTextBox("Connecting...");

      if (_socketId != null) {
        that.updateTextBox("Websocket already active brah !");
        return;
      }

      if (window.location.protocol == "https:") {
        protocol = "wss://";
      }
      var urlValue = protocol + document.getElementById('websocket-url').value + "/";
      store.dispatch(that.wsMessageActions.connectWs(_socketId, urlValue));

      _socketId.addEventListener("open", function (event) {
        that.updateTextBox(" Socket Connected ! ");
      });

      // Display messages received from the server
      _socketId.addEventListener("message", function (event) {
        that.updateTextBox("WS Server Says: " + event.data);
      });

      // Display any errors that occur
      _socketId.addEventListener("error", function (event) {
        if (_socketId != null) {
          store.dispatch(that.wsMessageActions.disconnectWs(_socketId));
        }
        that.updateTextBox(" Socket ERRORRRRRR ");
      });

      _socketId.addEventListener("close", function (event) {
        if (_socketId != null) {
          store.dispatch(that.wsMessageActions.disconnectWs(_socketId));
        }
        that.updateTextBox(" Socket CLOSED !!!!!!!! ");
      });
    }
  }, {
    key: 'disconnectSocket',
    value: function disconnectSocket() {
      var that = this;
      console.log("Closing message over socket");

      if (_socketId === null) {
        that.updateTextBox("WARNING : No Active Socket Connection Detected !");
        return;
      }
      store.dispatch(that.wsMessageActions.disconnectWs(_socketId));
      that.updateTextBox("Web Socket Connection Closed at :" + Date.now().toString());
    }
  }, {
    key: 'sendMessage',
    value: function sendMessage() {
      var that = this;
      console.log("Sending message over socket");

      if (_socketId === null) {
        that.updateTextBox("WARNING : No Active Socket Connection Detected !");
        return;
      }

      var chatMessage = document.getElementById('chat-msg').value;
      var socketPayload = "Message :" + chatMessage + " | Sent at :" + Date.now().toString();

      store.dispatch(that.wsMessageActions.sendWsMsg(_socketId, socketPayload));
      that.updateTextBox("Client Says: " + socketPayload);
    }
  }, {
    key: 'updateTextBox',
    value: function updateTextBox(msg) {
      if (message.textContent.split(/\r*\n/).length >= MAX_MSG_HISTORY) {
        message.textContent = '';
      }
      message.textContent = msg + "\n" + message.textContent;
    }
  }]);

  return WebsocketsRedux;
}();

Polymer(WebsocketsRedux);
//# sourceMappingURL=data:application/json;base64,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Q0UsS0FBSyxnQkFBTCxDQUFzQixZQUF0QixDQUFtQyxTQUFuQyxDQURGO0FBR0EsV0FBSyxhQUFMLENBQW1CLHNDQUFzQyxLQUFLLEdBQUwsR0FBVyxRQUFYLEVBQXpEO0FBQ0Q7OztrQ0FFYTtBQUNaLFVBQUksT0FBTyxJQUFYO0FBQ0EsY0FBUSxHQUFSLENBQVksNkJBQVo7O0FBRUEsVUFBRyxjQUFjLElBQWpCLEVBQXdCO0FBQ3RCLGFBQUssYUFBTCxDQUFtQixrREFBbkI7QUFDQTtBQUNEOztBQUVELFVBQUksY0FBYyxTQUFTLGNBQVQsQ0FBd0IsVUFBeEIsRUFBb0MsS0FBdEQ7QUFDQSxVQUFJLGdCQUFnQixjQUFjLFdBQWQsR0FBNkIsY0FBN0IsR0FBOEMsS0FBSyxHQUFMLEdBQVcsUUFBWCxFQUFsRTs7QUFFQSxZQUFNLFFBQU4sQ0FDRSxLQUFLLGdCQUFMLENBQXNCLFNBQXRCLENBQWlDLFNBQWpDLEVBQTZDLGFBQTdDLENBREY7QUFHQSxXQUFLLGFBQUwsQ0FBbUIsa0JBQWtCLGFBQXJDO0FBQ0Q7OztrQ0FFYSxHLEVBQUs7QUFDakIsVUFBSyxRQUFRLFdBQVIsQ0FBb0IsS0FBcEIsQ0FBMEIsT0FBMUIsRUFBbUMsTUFBbkMsSUFBNkMsZUFBbEQsRUFBb0U7QUFDbEUsZ0JBQVEsV0FBUixHQUFzQixFQUF0QjtBQUNEO0FBQ0QsY0FBUSxXQUFSLEdBQXNCLE1BQU0sSUFBTixHQUFhLFFBQVEsV0FBM0M7QUFDRDs7Ozs7O0FBR0gsUUFBUSxlQUFSIiwiZmlsZSI6InYtd3MtcG9seS5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBzdG9yZTtcbiAgICBsZXQgX3NvY2tldElkICAgPSBudWxsO1xuICAgIGxldCBfc29ja2V0TXNnICA9IG51bGw7XG4gICAgbGV0IF9zb2NrZXRVUkwgID0gbnVsbDtcbiAgICBjb25zdCBNQVhfTVNHX0hJU1RPUlkgPSAyMDtcblxuXG4gICAgY2xhc3MgV2Vic29ja2V0c1JlZHV4IHtcblxuICAgICAgYmVmb3JlUmVnaXN0ZXIoKSB7XG4gICAgICAgIHRoaXMuaXMgPSAnd3MtcG9seSc7XG5cbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0ge1xuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBjcmVhdGVkKCkge1xuICAgICAgICAvLyBEZWZpbmUgQWxsIEFjdGlvbnMgXG4gICAgICAgIHRoaXMud3NNZXNzYWdlQWN0aW9ucyA9IHtcbiAgICAgICAgICBzZW5kV3NNc2c6ICh3cywgd3NNZXNzYWdlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB0eXBlOiAnU0VORF9XU19NRVNTQUdFJyxcbiAgICAgICAgICAgICAgd3NJZDogd3MsXG4gICAgICAgICAgICAgIHdzTXNnOiB3c01lc3NhZ2VcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb25uZWN0V3M6ICh3cywgdXJsKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB0eXBlOiAnQ09OTkVDVF9XUycsXG4gICAgICAgICAgICAgIHdzSWQ6IHdzLFxuICAgICAgICAgICAgICB3c1VybDogdXJsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZGlzY29ubmVjdFdzOiAod3MpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdESVNDT05ORUNUX1dTJyxcbiAgICAgICAgICAgICAgd3NJZDogd3NcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcmVhZHkoKSB7XG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgICAgLy8gSW5pdGlhbGl6ZSAgUmVkdXggIFN0b3JlXG4gICAgICAgIGZ1bmN0aW9uIG1zZ1JlZHVjZXIoc3RhdGUgPSBJbW11dGFibGUuTWFwKHtcbiAgICAgICAgICB3c0lkICAgOiBudWxsLFxuICAgICAgICAgIHdzVXJsICA6ICcnLFxuICAgICAgICAgIHdzTXNnICA6ICcnXG4gICAgICAgICAgfSksIGFjdGlvbil7XG5cbiAgICAgICAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdTRU5EX1dTX01FU1NBR0UnOlxuICAgICAgICAgICAgICBhY3Rpb24ud3NJZC5zZW5kKGFjdGlvbi53c01zZyk7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgd3NJZCAgIDogYWN0aW9uLndzSWQsXG4gICAgICAgICAgICAgICAgd3NVcmwgIDogJycsXG4gICAgICAgICAgICAgICAgd3NNc2cgIDogYWN0aW9uLndzTXNnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ0NPTk5FQ1RfV1MnOlxuICAgICAgICAgICAgICBsZXQgbmV3U29ja2V0ID0gbmV3IFdlYlNvY2tldChhY3Rpb24ud3NVcmwpO1xuICAgICAgICAgICAgICBpZiAobmV3U29ja2V0LnJlYWR5U3RhdGUgPT09IDMpIHtcbiAgICAgICAgICAgICAgICBuZXdTb2NrZXQgPSBudWxsO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgd3NJZCAgIDogbmV3U29ja2V0LFxuICAgICAgICAgICAgICAgIHdzVXJsICA6IGFjdGlvbi53c1VybCxcbiAgICAgICAgICAgICAgICB3c01zZyAgOiAnJ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdESVNDT05ORUNUX1dTJzpcbiAgICAgICAgICAgICAgYWN0aW9uLndzSWQuY2xvc2UoKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB3c0lkICAgOiBudWxsLFxuICAgICAgICAgICAgICAgIHdzVXJsICA6ICcnLFxuICAgICAgICAgICAgICAgIHdzTXNnICA6ICcnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIHJldHVybiBzdGF0ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERlZmluZSBBcHAgYXMgY29tYmluYXRpb24gb2YgYWxsIHJlZHVjZXJzXG4gICAgICAgIGNvbnN0IHdzUmVkdXhBcHAgPSBSZWR1eC5jb21iaW5lUmVkdWNlcnMoe1xuICAgICAgICAgIG1zZ1JlZHVjZXJcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGluaXRpYWxTdGF0ZSA9IEltbXV0YWJsZS5MaXN0Lm9mKCk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIFN0b3JlXG4gICAgICAgIHN0b3JlID0gUmVkdXguY3JlYXRlU3RvcmUobXNnUmVkdWNlciwgaW5pdGlhbFN0YXRlKTtcblxuICAgICAgICAvLyBTdWJzY3JpYmUgVmFyaWFibGVzXG4gICAgICAgIHN0b3JlLnN1YnNjcmliZShmdW5jdGlvbigpe1xuICAgICAgICAgIF9zb2NrZXRJZCAgID0gc3RvcmUuZ2V0U3RhdGUoKS53c0lkO1xuICAgICAgICAgIF9zb2NrZXRNc2cgID0gc3RvcmUuZ2V0U3RhdGUoKS53c01zZztcbiAgICAgICAgICBfc29ja2V0VVJMICA9IHN0b3JlLmdldFN0YXRlKCkud3NVcmw7XG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGF0dGFjaGVkKCl7XG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgICAgLy8gdGhhdC5jb25uZWN0U29ja2V0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbm5lY3RTb2NrZXQoKSB7XG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgICAgbGV0IHByb3RvY29sID0gXCJ3czovL1wiO1xuICAgICAgICB0aGF0LnVwZGF0ZVRleHRCb3goXCJDb25uZWN0aW5nLi4uXCIpO1xuXG4gICAgICAgIGlmIChfc29ja2V0SWQgIT0gbnVsbCkge1xuICAgICAgICAgIHRoYXQudXBkYXRlVGV4dEJveChcIldlYnNvY2tldCBhbHJlYWR5IGFjdGl2ZSBicmFoICFcIik7XG4gICAgICAgICAgcmV0dXJuIDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYod2luZG93LmxvY2F0aW9uLnByb3RvY29sID09IFwiaHR0cHM6XCIpIHtcbiAgICAgICAgICBwcm90b2NvbCA9IFwid3NzOi8vXCI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHVybFZhbHVlID0gcHJvdG9jb2wgKyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2Vic29ja2V0LXVybCcpLnZhbHVlICsgXCIvXCI7XG4gICAgICAgIHN0b3JlLmRpc3BhdGNoKFxuICAgICAgICAgIHRoYXQud3NNZXNzYWdlQWN0aW9ucy5jb25uZWN0V3MoX3NvY2tldElkLCB1cmxWYWx1ZSlcbiAgICAgICAgICApXG5cbiAgICAgICAgX3NvY2tldElkLmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgdGhhdC51cGRhdGVUZXh0Qm94KFwiIFNvY2tldCBDb25uZWN0ZWQgISBcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIERpc3BsYXkgbWVzc2FnZXMgcmVjZWl2ZWQgZnJvbSB0aGUgc2VydmVyXG4gICAgICAgIF9zb2NrZXRJZC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIHRoYXQudXBkYXRlVGV4dEJveChcIldTIFNlcnZlciBTYXlzOiBcIiArIGV2ZW50LmRhdGEpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBEaXNwbGF5IGFueSBlcnJvcnMgdGhhdCBvY2N1clxuICAgICAgICBfc29ja2V0SWQuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgaWYoX3NvY2tldElkICE9IG51bGwgKSB7XG4gICAgICAgICAgICBzdG9yZS5kaXNwYXRjaChcbiAgICAgICAgICAgIHRoYXQud3NNZXNzYWdlQWN0aW9ucy5kaXNjb25uZWN0V3MoX3NvY2tldElkKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGF0LnVwZGF0ZVRleHRCb3goXCIgU29ja2V0IEVSUk9SUlJSUlIgXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBfc29ja2V0SWQuYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgaWYoX3NvY2tldElkICE9IG51bGwgKSB7XG4gICAgICAgICAgICBzdG9yZS5kaXNwYXRjaChcbiAgICAgICAgICAgIHRoYXQud3NNZXNzYWdlQWN0aW9ucy5kaXNjb25uZWN0V3MoX3NvY2tldElkKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGF0LnVwZGF0ZVRleHRCb3goXCIgU29ja2V0IENMT1NFRCAhISEhISEhISBcIik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBkaXNjb25uZWN0U29ja2V0KCkge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ2xvc2luZyBtZXNzYWdlIG92ZXIgc29ja2V0XCIpO1xuXG4gICAgICAgIGlmKF9zb2NrZXRJZCA9PT0gbnVsbCApIHtcbiAgICAgICAgICB0aGF0LnVwZGF0ZVRleHRCb3goXCJXQVJOSU5HIDogTm8gQWN0aXZlIFNvY2tldCBDb25uZWN0aW9uIERldGVjdGVkICFcIik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHN0b3JlLmRpc3BhdGNoKFxuICAgICAgICAgIHRoYXQud3NNZXNzYWdlQWN0aW9ucy5kaXNjb25uZWN0V3MoX3NvY2tldElkKVxuICAgICAgICApXG4gICAgICAgIHRoYXQudXBkYXRlVGV4dEJveChcIldlYiBTb2NrZXQgQ29ubmVjdGlvbiBDbG9zZWQgYXQgOlwiICsgRGF0ZS5ub3coKS50b1N0cmluZygpKTtcbiAgICAgIH1cblxuICAgICAgc2VuZE1lc3NhZ2UoKSB7XG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIG1lc3NhZ2Ugb3ZlciBzb2NrZXRcIik7XG5cbiAgICAgICAgaWYoX3NvY2tldElkID09PSBudWxsICkge1xuICAgICAgICAgIHRoYXQudXBkYXRlVGV4dEJveChcIldBUk5JTkcgOiBObyBBY3RpdmUgU29ja2V0IENvbm5lY3Rpb24gRGV0ZWN0ZWQgIVwiKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2hhdE1lc3NhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhdC1tc2cnKS52YWx1ZTtcbiAgICAgICAgbGV0IHNvY2tldFBheWxvYWQgPSBcIk1lc3NhZ2UgOlwiICsgY2hhdE1lc3NhZ2UgKyAgXCIgfCBTZW50IGF0IDpcIiArIERhdGUubm93KCkudG9TdHJpbmcoKTtcbiAgICAgICAgXG4gICAgICAgIHN0b3JlLmRpc3BhdGNoKFxuICAgICAgICAgIHRoYXQud3NNZXNzYWdlQWN0aW9ucy5zZW5kV3NNc2coIF9zb2NrZXRJZCAsIHNvY2tldFBheWxvYWQpXG4gICAgICAgIClcbiAgICAgICAgdGhhdC51cGRhdGVUZXh0Qm94KFwiQ2xpZW50IFNheXM6IFwiICsgc29ja2V0UGF5bG9hZCk7XG4gICAgICB9XG5cbiAgICAgIHVwZGF0ZVRleHRCb3gobXNnKSB7XG4gICAgICAgIGlmICggbWVzc2FnZS50ZXh0Q29udGVudC5zcGxpdCgvXFxyKlxcbi8pLmxlbmd0aCA+PSBNQVhfTVNHX0hJU1RPUlkgKSB7XG4gICAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICB9XG4gICAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSBtc2cgKyBcIlxcblwiICsgbWVzc2FnZS50ZXh0Q29udGVudDtcbiAgICAgIH1cblxuICAgIH1cbiAgICBQb2x5bWVyKFdlYnNvY2tldHNSZWR1eCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
