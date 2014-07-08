$(document).ready(function() {
	var currentCrimes = [];
	$.ajax({
		url: 'http://polisen.se/Skane/Aktuellt/Handelser/?p=1&tbSearch=&ddl=0&tbFrom=&tbTo=',
		type: 'get',
		dataType: 'html',
		success: function(data) {
			data = data.replace(/<img\b[^>]*>/ig, '');
			data = data.replace(/<script.*?>([\w\W\d\D\s\S\0\n\f\r\t\v\b\B]*?)<\/script>/gi, '');
			var crimeList = jQuery(data).find('.page-list').find('li');
			console.log(crimeList.find('.news-date')[0]);
			console.log(crimeList[0]);
			for (var i = crimeList.length - 1; i >= 0; i--) {
				currentCrimes[i] = fetchInformationAboutCrime(crimeList[i]);
			};

		}
	});


	// TODO: Namn?
	function Crime() {
		date: ;
		timestamp: ;
		location: ;
		description: ;
		crimeType: ;
	}

	// Data should be a array of html elements contained within a <li> tag.
	// In other words a post at http://polisen.se/COUNTY/Aktuellt/Handelser/
	function fetchInformationAboutCrime(data) {
		var fetchedCrime = new Crime();

		//Text containing date, time, crimetype and location
		var header = $(data).find('h3').find('a')[0].text;
		//Text containing the description of the crime
		var info = $(data).find('p').find('span')[1].innerText;
		//Load all variables into the Crime object
		fetchedCrime.date = header.substring(0, 10);
		fetchedCrime.timestamp = header.substring(10, 16);
		fetchedCrime.crimetype = extractCrimeType(header);
		fetchedCrime.location = extractLocation(header) + "," + info.substring(info.indexOf(',') + 1);
		fetchedCrime.description = info.indexOf(',')!= -1?info.substring(0, info.indexOf(',')):info;


		console.log("Date: " + fetchedCrime.date + " Time: " + fetchedCrime.timestamp + " Crime: " + fetchedCrime.crimetype + " Location: " + fetchedCrime.location + " Description: " + fetchedCrime.description);



		return fetchedCrime;

	}

	function extractCrimeType(header) {
		var secondComma = header.indexOf((','), 18);
		var thirdComma = header.indexOf((','), secondComma + 1);
		if (thirdComma != -1) {
			return header.substring(17, thirdComma);
		}
		return header.substring(17, secondComma);

	}

	function extractLocation(header) {
		var secondComma = header.indexOf((','), 18);
		var thirdComma = header.indexOf((','), secondComma + 1);
		if (thirdComma != -1) {
			return header.substring(thirdComma + 2);
		}
		return header.substring(secondComma + 2);
	}

	function extractLocfromInfo(info) {
		if(info.indexOf(',')!=-1){
			return "," + info.substring(info.indexOf(',') + 1);
		}else{
			return "" ; 
		}
	}


});	