var count = 0
var approved = false
var temporalSpacing = 10
var playHandlers = []

function pauseAll() {
	var vid = document.getElementsByTagName('video')
	for (var i = 0;i < vid.length ; i++) {
		var v = vid[i]
		v.pause()
	}
}

function onClick(e) {
	var vid = document.getElementsByTagName('video')
	for (var i = 0;i < vid.length ; i++) {
		var r = vid[i].getBoundingClientRect()
		if  (r.left <= e.clientX && e.clientX < r.right && r.top <= e.clientY && e.clientY < r.bottom) {
			approved = true
			document.removeEventListener("click", onClick)
		}
	}
}

function clearHandlers() {
	console.log("approved")
	for (var i=0;i<playHandlers.length;i++) {
		var p = playHandlers[i]
		p[0].removeEventListener('play', p[1])
	}
}

document.addEventListener("click", onClick)

function watchForVideos() {
	if (approved) {
		clearHandlers()
		return
	}
	var vid = document.getElementsByTagName('video')
	for (var i = 0; i < vid.length ; i++) {
		var v = vid[i]
		v.pause()
		if (! v.processedByMe) {
			console.log("processing")
			function onPlay() {
				if (approved) {
					clearHandlers()
					return
				}
				console.log("forcing pause")
				pauseAll()
			}
			v.addEventListener('play', onPlay )
			playHandlers.push( [v,onPlay] )
			v.processedByMe = true
		}
	}
	count++;
	if (count % 100 == 0) {
		temporalSpacing *= 2
		if (temporalSpacing > 5000)
			temporalSpacing = 5000
	}
	setTimeout(watchForVideos, temporalSpacing)
}

watchForVideos()
