L.Control.SleepMapControl=L.Control.extend({initialize:function(a){L.setOptions(this,a)},options:{position:"topright",prompt:"disable map",styles:{backgroundColor:"white",padding:"5px",border:"2px solid gray"}},buildContainer:function(){var a=this,b=L.DomUtil.create("p","sleep-button"),c=this._nonBoundEvent.bind(this);return b.appendChild(document.createTextNode(this.options.prompt)),L.DomEvent.addListener(b,"click",c),L.DomEvent.addListener(b,"touchstart",c),Object.keys(this.options.styles).map(function(c){b.style[c]=a.options.styles[c]}),this._container=b},onAdd:function(){return this._container||this.buildContainer()},_nonBoundEvent:function(a){return L.DomEvent.stop(a),this._map&&this._map.sleep._sleepMap(),!1}}),L.Control.sleepMapControl=function(){return new L.Control.SleepMapControl},L.Map.mergeOptions({sleep:!0,sleepTime:750,wakeTime:750,wakeMessageTouch:"Touch to Wake",sleepNote:!0,hoverToWake:!0,sleepOpacity:.7,sleepButton:L.Control.sleepMapControl}),L.Map.Sleep=L.Handler.extend({addHooks:function(){this.sleepNote=L.DomUtil.create("p","sleep-note",this._map._container),this._enterTimeout=null,this._exitTimeout=null,this._sleepButton=this._map.options.sleepButton(),this._map.tap&&this._map.addControl(this._sleepButton);var b=this._map._container.style;b.WebkitTransition+="opacity .5s",b.MozTransition+="opacity .5s",this._setSleepNoteStyle(),this._sleepMap()},removeHooks:function(){this._map.scrollWheelZoom.enabled()||this._map.scrollWheelZoom.enable(),this._map.tap&&!this._map.tap.enabled()&&(this._map.touchZoom.enable(),this._map.dragging.enable(),this._map.tap.enable()),L.DomUtil.setOpacity(this._map._container,1),L.DomUtil.setOpacity(this.sleepNote,0),this._removeSleepingListeners(),this._removeAwakeListeners()},_setSleepNoteStyle:function(){var a="",b=this.sleepNote.style;if(a=this._map.tap?this._map.options.wakeMessageTouch:this._map.options.wakeMessage?this._map.options.wakeMessage:this._map.options.hoverToWake?"click or hover to wake":"click to wake",this._map.options.sleepNote&&(this.sleepNote.appendChild(document.createTextNode(a)),b.pointerEvents="none",b.maxWidth="150px",b.transitionDuration=".2s",b.zIndex=5e3,b.opacity=".6",b.margin="auto",b.textAlign="center",b.borderRadius="4px",b.top="50%",b.position="relative",b.padding="5px",b.border="solid 2px black",b.background="white",this._map.options.sleepNoteStyle)){var c=this._map.options.sleepNoteStyle;Object.keys(c).map(function(a){b[a]=c[a]})}},_wakeMap:function(a){this._stopWaiting(),this._map.scrollWheelZoom.enable(),this._map.tap&&(this._map.touchZoom.enable(),this._map.dragging.enable(),this._map.tap.enable(),this._map.addControl(this._sleepButton)),L.DomUtil.setOpacity(this._map._container,1),this.sleepNote.style.opacity=0,this._addAwakeListeners()},_sleepMap:function(){this._stopWaiting(),this._map.scrollWheelZoom.disable(),this._map.tap&&(this._map.touchZoom.disable(),this._map.dragging.disable(),this._map.tap.disable(),this._map.removeControl(this._sleepButton)),L.DomUtil.setOpacity(this._map._container,this._map.options.sleepOpacity),this.sleepNote.style.opacity=.4,this._addSleepingListeners()},_wakePending:function(){if(this._map.once("mousedown",this._wakeMap,this),this._map.options.hoverToWake){var a=this;this._map.once("mouseout",this._sleepMap,this),a._enterTimeout=setTimeout(function(){a._map.off("mouseout",a._sleepMap,a),a._wakeMap()},a._map.options.wakeTime)}},_sleepPending:function(){var a=this;a._map.once("mouseover",a._wakeMap,a),a._exitTimeout=setTimeout(function(){a._map.off("mouseover",a._wakeMap,a),a._sleepMap()},a._map.options.sleepTime)},_addSleepingListeners:function(){this._map.once("mouseover",this._wakePending,this),this._map.tap&&this._map.once("click",this._wakeMap,this)},_addAwakeListeners:function(){this._map.once("mouseout",this._sleepPending,this)},_removeSleepingListeners:function(){this._map.options.hoverToWake&&this._map.off("mouseover",this._wakePending,this),this._map.off("mousedown",this._wakeMap,this),this._map.tap&&this._map.off("click",this._wakeMap,this)},_removeAwakeListeners:function(){this._map.off("mouseout",this._sleepPending,this)},_stopWaiting:function(){this._removeSleepingListeners(),this._removeAwakeListeners();var a=this;this._enterTimeout&&clearTimeout(a._enterTimeout),this._exitTimeout&&clearTimeout(a._exitTimeout),this._enterTimeout=null,this._exitTimeout=null}}),L.Map.addInitHook("addHandler","sleep",L.Map.Sleep);
