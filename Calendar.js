function Calendar() {
	
	//常量
	var CONST_ADDED_EVENTS = 'CONST_ADDED_EVENTS';
	//每个月6行
	var CONST_DAYS_ROWS = 6;
	//每个月7列，表示周日到周一七天
	var CONST_DAYS_COLUMS = 7;
	//区域语言
	var lang = 'ZH';

	var monthNames = {};
	monthNames['ZH'] = new Array('一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月');

	var yearNames = {};
	yearNames['ZH'] = '年';

	var monthDays = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	
	var weekNames = ['日','一','二','三','四','五','六'];
	//待办事项数据结构
	var toDoObj = {};
	//              '2015-3-12':
	//              [
	//                  {
	//                      time:'12:05',
	//                      content:'观看中央新闻',
	//                      id:'1'
	//                  },
	//                  {
	//                      time:'15:05',
	//                      content:'洗衣服',
	//                      id:'2'
	//                  }
	//              ],
	//              '2015-2-1':
	//              [
	//              	{
	//                      time:'11:05',
	//                      content:'观看中央财经频道',
	//                      id:'5'
	//                  },
	//                  {
	//                      time:'12:05',
	//                      content:'观看中央新闻1',
	//                      id:'3'
	//                  },
	//                  {
	//                      time:'15:05',
	//                      content:'刷鞋子',
	//                      id:'4'
	//                  }
	//              ]
	//              
	//          };


	var now = new Date();

	// var currentDate = new Date("May 25, 2015");
	var currentDate = new Date(now); //当前要显示的日期
	var currentYear = currentDate.getFullYear(); //要显示的年
	var currentMonth = currentDate.getMonth(); //要显示的月索引
	var currentDayIndex = currentDate.getDate();

	function initCalendarAndEvents() {
		//本地存储中取得已经保存的数据
		if (localStorage.getItem(CONST_ADDED_EVENTS)) {
			toDoObj = JSON.parse(localStorage.getItem(CONST_ADDED_EVENTS));
		}
		//初始化格子6*7
		//initCalendarDiv();
		//将格子初始化为当前日期
		initDivDays(now);
		//刷新显示年月的标题
		freshmonthTitle();
		//无效//本意让每个格子高度等于宽度，这样选中状态的背景为圆形
		initDaySpanHeight();
		//添加事件监听
		addEventListenersFun();
		//初始化当前天的待办事项列表
		initcurrentDayEventList();
		//刷新当前月待办事项数目
		freshmonthTodoCount();
	};
	//计算当月待办事项数据
	function freshmonthTodoCount() {
			var num = 0;
			for (var str in toDoObj) {
				var strArr = str.split('-');
				if (strArr.length == 3) {
					if (strArr[0] == currentYear && Number(strArr[1]) == Number(currentMonth + 1)) {
						num = num + toDoObj[str].length;
					}
				}
			}
			document.getElementById('monthTodoCount').innerHTML = num;
		}
		//计算当前天待办事项数据

	function freshtodayTodoCount() {
			var todoStr = currentYear + '-' + Number(currentMonth + 1) + '-' + currentDayIndex;
			if (toDoObj && toDoObj.hasOwnProperty(todoStr)) {
				var elist = toDoObj[todoStr];
				if (elist instanceof Array) {
					var elen = elist.length;
					document.getElementById('selectDayCount').innerHTML = elen + ' 事项';
				}
			}
		}
		
	//初始化某一天的事件列表
	function initcurrentDayEventList() {
			document.getElementById('eventList').innerHTML = '';
			var todoStr = currentYear + '-' + Number(currentMonth + 1) + '-' + currentDayIndex;
			if (toDoObj && toDoObj.hasOwnProperty(todoStr)) {
				var elist = toDoObj[todoStr];
				if (elist instanceof Array) {
					var elen = elist.length;
					document.getElementById('selectDayCount').innerHTML = elen + ' 事项';
					for (var i = 0; i < elen; i++) {
						var obj = elist[i];
						addOneEventCase(obj);
					}
				}
			} else {
				document.getElementById('selectDayCount').innerHTML = '0 事项';
			}
		}
	//将单个待办事项案例添加到显示列表中
	function addOneEventCase(obj) {
			var esingle = document.createElement('div');
			esingle.className = 'eventSingle';

			var content = document.createElement('div');
			content.className = 'eventContent';
			content.innerHTML = obj['content'];

			var etime = document.createElement('div');
			etime.className = 'eventTime';

			var sjspan = document.createElement('span');
			sjspan.className = 'iconfont icon-shijian shijianicon';
			var tspan = document.createElement('span');
			tspan.id = 'eventTimeSpan';
			tspan.innerHTML = obj['time'];

			var dspan = document.createElement('span');
			dspan.className = 'iconfont icon-shanchu1 deleteicon';
			dspan.onclick = function() {
				document.getElementById('eventList').removeChild(esingle);
				deleteContent(obj);
			}

			etime.appendChild(sjspan);
			etime.appendChild(tspan);
			etime.appendChild(dspan);

			esingle.appendChild(content);
			esingle.appendChild(etime);

			var elist = document.getElementById('eventList');
			//依次添加在列表顶端，和添加按钮点击时候处理一致
			elist.insertBefore(esingle, elist.firstChild);
		}
	//数据集中删除数据
	function deleteContent(obj) {
			for (var str in toDoObj) {
				var lArr = toDoObj[str];
				var oIndex = lArr.indexOf(obj);
				if (oIndex > -1) {
					lArr.splice(oIndex, 1);
				}
				if (lArr.length == 0) {
					var classname = lastClickSpan.className;
					if (classname.indexOf('haveEvent') > -1) {
						lastClickSpan.className = classname.replace('haveEvent', '');
					}
				}
			}
			localStorage.setItem(CONST_ADDED_EVENTS, JSON.stringify(toDoObj));
			freshtodayTodoCount();
			freshmonthTodoCount();
		}
	////初始化高度，貌似不起效////
	function initDaySpanHeight() {
			var container = document.getElementById('thismonth');
			var spans = container.getElementsByClassName('daySpan');
			var sLen = spans.length;
			for (var i = 0; i < sLen; i++) {
				var span = spans[i];
				span.style.height = span.style.width;
			}
		}
	//添加事件监听
	function addEventListenersFun() {
			document.getElementById('preBtn').onclick = preBtnClick;
			document.getElementById('nextBtn').onclick = nextBtnClick;
			document.getElementById('thismonth').onclick = function(event) {
				event.preventDefault();
				dayContainerClick(event);
			};
			document.getElementById('eventAdd').onclick = eventAddClick;
		}
	//添加按钮点击时候，执行添加
	function eventAddClick() {
			event.stopPropagation();
			var content1 = document.getElementById('eventName').value;
			var time1 = document.getElementById('evevtTime').value;
			if (document.getElementById('eventAllday').checked) {
				time1 = '全天';
			}
			if (content1 == '' || content1 == undefined || content1 == null) {
				content1 = '事件名称';
			}
			var cstr = currentYear + '-' + Number(currentMonth + 1) + '-' + currentDayIndex;
			var obj = {
				time: time1,
				content: content1
			};
			if (toDoObj.hasOwnProperty(cstr)) {
				var toArr = toDoObj[cstr];
				obj['id'] = toArr.length + 1;
				toArr.push(obj);
			} else {
				obj['id'] = '1';
				toDoObj[cstr] = [obj];
				if (lastClickSpan) {
					lastClickSpan.className = lastClickSpan.className + ' haveEvent';
				}
			}

			localStorage.setItem(CONST_ADDED_EVENTS, JSON.stringify(toDoObj));
			freshmonthTodoCount();
			freshtodayTodoCount();
			addOneEventCase(obj);
			//添加单条案例之后，将输入框和时间选择重置为默认值
			setTimeout(function() {
				document.getElementById('eventName').value = '';
				document.getElementById('evevtTime').value = '00:00';
			}, 100)
		}
	/*
	 * 记录当前被点击的格子span，当点击切换至其他格子的时候，先清除此格子样式
	 * 再为下次点击格子添加选中状态样式selected
	 * */
	var lastClickSpan;

	function clearClickSpanStyle() {
		if (lastClickSpan != null && lastClickSpan != undefined) {
			var classname = lastClickSpan.className;
			if (classname.indexOf('selected') > -1) {
				lastClickSpan.className = classname.replace('selected', '');
			}
		}
	}

	//点击事件委托
	function dayContainerClick(event) {
		if (event.target && event.target.nodeName == 'SPAN') {
			event.stopPropagation();
			clearClickSpanStyle();
			event.stopPropagation();
			var span = event.target;
			lastClickSpan = span;
			if (span.innerHTML != '&nbsp;') {
				span.className = span.className + ' selected';
				currentDayIndex = span.innerHTML;

				initcurrentDayEventList();
			}
		}
	}

	//清空
	function clearEventlist() {
			document.getElementById('eventList').innerHTML = '';
			document.getElementById('selectDayCount').innerHTML = '0 事项';
		}
	
	//上个月 点击
	function preBtnClick(event) {
			event.preventDefault();
			currentMonth--;
			if (currentMonth == -1) {
				currentMonth = 11;
				currentYear--;
			}
			clearEventlist();
			currentDayIndex = 1;
			freshmonthTitle();
			initDivDays();
			freshmonthTodoCount();
		}
	
	//下个月点击
	function nextBtnClick(event) {
			event.preventDefault();
			currentMonth++;
			if (currentMonth == 12) {
				currentMonth = 0;
				currentYear++;
			}
			clearEventlist();
			currentDayIndex = 1;
			freshmonthTitle();
			initDivDays();
			freshmonthTodoCount();
		}
	
	//更新头信息
	function freshmonthTitle() {
			document.getElementById('monthTitle').innerHTML = currentYear + yearNames[lang] + ' ' + monthNames[lang][currentMonth];
		}
	
	//是不是闰年
	function isLeapYear(year) {
		var f = new Date();
		f.setYear(year);
		f.setMonth(1);
		f.setDate(29);
		return f.getDate() == 29;
	}
	
	//返回二月份的天数
	function getFebDayNum(year) {
			var feb = 28;
			if (isLeapYear(year) === true) {
				feb = 29;
			} else {
				feb = 28;
			}
			return feb;
	}
	
	//初始化摆放日期的格子
	function initCalendarDiv() {
		for (var i = 0; i < CONST_DAYS_ROWS; i++) {
			var dayDIV = document.createElement('div');
			dayDIV.className = 'dayContainer';
			for (var j = 0; j < CONST_DAYS_COLUMS; j++) {
				var daySpan = document.createElement('span');
				daySpan.className = 'daySpan';
				dayDIV.appendChild(daySpan);
				daySpan.innerHTML = '&nbsp;';
			}
			document.getElementById('thismonth').appendChild(dayDIV);
		}
	}

	function haveEvent(year, month, day) {
			var str = year + '-' + Number(month + 1) + '-' + day;
			return (toDoObj.hasOwnProperty(str) && toDoObj[str].length > 0);
		}
	
	/*
	 * 将当前年 月的日期摆放到格子里，包括通过上个月、下个月点击切换到的年月
	 * 如果初始化的月份正好是当前年月，默认选中当天的格子
	 * 否则，选中每个月第一天
	 * */
	function initDivDays(freshDate) {
		
		clearClickSpanStyle();
		freshmonthTitle();
		freshDate = new Date(currentYear, currentMonth, currentDayIndex);
		freshDate.setDate(1); //当前月第一天
		var firstDay = freshDate.getDay(); //本月第一天星期几的索引
		var currentDayNum = monthDays[currentMonth];
		if (currentMonth == 1) {
			currentDayNum = getFebDayNum(currentYear);
		}
		var dayIndex = 1;

		var divs = document.getElementsByClassName('dayContainer');
		var divsLen = divs.length;
		for (var i = 0; i < divsLen; i++) {
			var dayDIV = divs[i];
			var spans = dayDIV.getElementsByTagName('span');
			var spansLen = spans.length;
			for (var j = 0; j < spansLen; j++) {
				var daySpan = spans[j];
				var strCNAME = daySpan.className;
				//清空格子关于选中状态、today状态及事件状态的样式
				if (strCNAME.indexOf('today') > -1) {
					daySpan.className = strCNAME.replace('today', '');
				}
				if (strCNAME.indexOf('selected') > -1) {
					daySpan.className = strCNAME.replace('selected', '');
				}
				if (strCNAME.indexOf('haveEvent') > -1) {
					daySpan.className = strCNAME.replace('haveEvent', '');
				}

				if (haveEvent(currentYear, currentMonth, dayIndex)) {
					daySpan.className = daySpan.className + ' haveEvent';
				}
				if (i == 0) {
					if (j < firstDay) {
						daySpan.innerHTML = '&nbsp;';
					} else {
						daySpan.innerHTML = dayIndex;
						if (dayIndex == currentDayIndex) {
							daySpan.className = daySpan.className + ' selected';
							lastClickSpan = daySpan;
						}
						dayIndex++;
					}
				} else {
					if (dayIndex < currentDayNum + 1) {
						daySpan.innerHTML = dayIndex;
						dayIndex++;
					} else {
						daySpan.innerHTML = '&nbsp;';
					}
				}
				//当前年当前月，将本月第一日选中格式清除
				if (currentYear == now.getFullYear() && currentMonth == now.getMonth()) {
					clearClickSpanStyle();
				}
				if (currentYear == now.getFullYear() && currentMonth == now.getMonth() && dayIndex == (now.getDate() + 1)) {
					//如果是当前正好是当月第一天，就将选中状态去掉，换做today的状态
					currentDayIndex = now.getDate(); //初始化事件列表由每个月第一天换成本月当日的
					strCNAME = daySpan.className;
					if (strCNAME.indexOf('selected') > -1) {
						daySpan.className = strCNAME.replace('selected', '');
					}
					daySpan.className = daySpan.className + ' today';
					lastClickSpan = daySpan;
				}
			}
		}
		//初始化格子之后，初始化选中日期的事件列表
		initcurrentDayEventList();
	}
	
	/*
	 * 对外接口在给定容器（id）内创建日历 
	 * */
	function initHeadersAndAdds(id)
	{
		var mainBody = document.getElementById(id);
		
		var monthHead = document.createElement('div');
		monthHead.id = 'monthHeader';
		var prebtn = document.createElement('span');
		prebtn.id = 'preBtn';
		prebtn.className = 'pre iconfont icon-zuo';
		monthHead.appendChild(prebtn);
		var mtitle = document.createElement('h2');
		mtitle.id = 'monthTitle';
		monthHead.appendChild(mtitle);
		var nextbtn = document.createElement('span');
		nextbtn.id = 'nextBtn';
		nextbtn.className = 'next  iconfont icon-you';
		monthHead.appendChild(nextbtn);
		mainBody.appendChild(monthHead);
		
		var tCount = document.createElement('div');
		tCount.id = 'todoCount';
		tCount.innerHTML = '本月待办事项共：<b id="monthTodoCount"></b>';
		mainBody.appendChild(tCount);
		
		var weekHead = document.createElement('div');
		weekHead.className = 'weekHeader';
		var wLen = weekNames.length;
		for(var i=0;i<wLen;i++)
		{
			var weekD = document.createElement('span');
			weekD.innerHTML = weekNames[i];
			weekHead.appendChild(weekD);
		}
		mainBody.appendChild(weekHead);
		
		var thismonth = document.createElement('div');
		thismonth.id = 'thismonth';
		mainBody.appendChild(thismonth);
		initCalendarDiv();
		
		var addDiv1 = document.createElement('div');
		addDiv1.className = 'newevnets';
		var eName = document.createElement('input');
		eName.type = 'text';
		eName.placeholder = '事件名称';
		eName.id = 'eventName';
		addDiv1.appendChild(eName);
		var eaddBtn = document.createElement('input');
		eaddBtn.type = 'button';
		eaddBtn.value = '添加';
		eaddBtn.id = 'eventAdd';
		addDiv1.appendChild(eaddBtn);
		mainBody.appendChild(addDiv1);
		
		var addDiv2 = document.createElement('div');
		addDiv2.className = 'newevnets';
		var timeSpan = document.createElement('span');
		timeSpan.className = 'iconfont icon-shijian shijianicon';
		addDiv2.appendChild(timeSpan);
		var timeSel = document.createElement('input');
		timeSel.type = 'time';
		timeSel.value = '00:00';
		timeSel.id = 'evevtTime';
		addDiv2.appendChild(timeSel);
		var alldayLab = document.createElement('label');
		alldayLab.innerHTML = '全天';
		alldayLab.id = 'alldayLab';
//		alldayLab.for('eventAllday');
		addDiv2.appendChild(alldayLab);
		var check = document.createElement('input');
		check.id = 'eventAllday';
		check.type = 'checkbox';
		addDiv2.appendChild(check);
		mainBody.appendChild(addDiv2);
		
		var ecount = document.createElement('div');
		ecount.id = 'eventCount';
		ecount.innerHTML = '<h4 id="selectDayCount">0 事项</h4>';
		mainBody.appendChild(ecount);
		
		var elist = document.createElement('eventList');
		elist.id = 'eventList';
		mainBody.appendChild(elist);
		
		initCalendarAndEvents();
	}
	
	this.initHeadersAndAdds = initHeadersAndAdds;
}
