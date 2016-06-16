var my_app = angular.module('web', ['ngRoute']);

my_app.config(function($interpolateProvider, $routeProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');

    $routeProvider.when('/', {
    	controller: 'neraca',
    	templateUrl: 'temp/dashboard.html',
    }).when('/akun/', {
    	controller: 'akunController',
    	templateUrl: 'temp/akun/baru.html',
    }).when('/jurnal/baru/', {
    	controller: 'jurnalController',
    	templateUrl: 'temp/jurnal/baru.html',
    }).when('/jurnal/', {
    	controller: 'jurnalIndex',
    	templateUrl: 'temp/jurnal.html',
    }).when('/coa/', {
    	controller: 'coaController',
    	templateUrl: 'temp/akun/index.html',
    }).when('/laporan/', {
    	controller: 'laporanController',
    	templateUrl: 'temp/laporan.html',
    }).when('/akun/:kode/', {
    	template: '<h1>Akun</h1>',
    }).when('/jurnal/:kode/', {
    	controller: 'editJurnalUmum',
    	templateUrl: 'temp/jurnal/baru.html',
    }).when('/coa/:kode/', {
    	controller: 'editCoa',
    	templateUrl: 'temp/akun/baru.html',
    }).when('/akun/:kode/', {
    	controller: 'editKategori',
    	templateUrl: 'temp/akun/baru.html',
    });
});

my_app.controller("editKategori", function($scope, $http, $routeParams, $rootScope){
	$scope.load = function(){
		$http.get('http://localhost:8000/api/kategori/root/').then(function(data){
			$scope.list_root_kategori = data.data;
			$rootScope.title = "- " + $routeParams.kode;
			$http.get('/api/kategori/' + $routeParams.kode + '/').then(function(data){
				$scope.data = data.data;
				$scope.data.tipe = true;
				if(angular.isDefined($scope.data.parent) && ( $scope.data.parent !== null )){
					var kategori = $scope.data.parent.split("/");
					var jml_k = kategori.length;
					var kode_k = kategori[jml_k - 2][0] + kategori[jml_k - 2][1];
					$scope.kode_sk = kategori[jml_k - 2];
					angular.forEach( $scope.list_root_kategori, function(value, key){
						if( value.kode == kode_k ){
							$scope.data.kategori = value.kode;
							$scope.onChangeKategori();
							return;
						};
					});
				};
			});
		});
	};
	$scope.cariSub = function(){
		angular.forEach($scope.list_root_subkategori, function(value, key){
			if( value.kode == $scope.kode_sk){
				$scope.data.subkategori = value.kode;
				$scope.data.kode = $scope.data.kode.split("-")[1];
				return;
			};
		});
	};

	$scope.onChangeKategori = function(){
		$http.get('http://localhost:8000/api/kategori/?root=' + $scope.data.kategori).then(function(data){
			$scope.list_root_subkategori = data.data;
			$scope.cariSub();
		});
	};
	$scope.onSave = function(){
		// code
		if( (angular.isDefined($scope.data.kode) && angular.isDefined($scope.data.nama) ) && ( $scope.data.kode !== "" && $scope.data.nama !== "") ){
			if( angular.isDefined($scope.data.tipe) && $scope.data.tipe == true ){
				if( angular.isDefined($scope.data.subkategori ) && $scope.data.subkategori !== ""){
					$scope.data.parent = "/api/kategori/" + $scope.data.subkategori + "/";
				}else{
					$scope.data.parent = "/api/kategori/" + $scope.data.kategori + "/";
				};
				$http.put($scope.data.url, $scope.data).then(function(data){
					alert(data.data.kode + " berhasil disimpan.");
				}, function(data){
					alert("Data tidak berhasil disimpan.");
				});
			}else{
				$scope.data.kode = $scope.data.subkategori + "-" + $scope.data.kode;
				$scope.data.kategori = "/api/kategori/" + $scope.data.subkategori + "/";
				$http.put($scope.data.url, $scope.data).then(function(data){
					alert(data.data.kode + " berhasil disimpan.");
				}, function(data){
					alert("Data tidak berhasil disimpan.");
				});
			};
			$scope.load();
		};
	};
	$scope.load();
});

my_app.controller("editCoa", function($scope, $http, $routeParams, $rootScope){
	$scope.load = function(){
		$http.get('http://localhost:8000/api/kategori/root/').then(function(data){
			$scope.list_root_kategori = data.data;
			$rootScope.title = "- " + $routeParams.kode;
			$http.get('/api/akun/' + $routeParams.kode + '/').then(function(data){
				$scope.data = data.data;
				var kategori = $scope.data.kategori.split("/");
				var jml_k = kategori.length;
				var kode_k = kategori[jml_k - 2][0] + kategori[jml_k - 2][1];
				$scope.kode_sk = kategori[jml_k - 2];
				angular.forEach( $scope.list_root_kategori, function(value, key){
					if( value.kode == kode_k ){
						$scope.data.kategori = value.kode;
						$scope.onChangeKategori();
						return;
					};
				});
			});
		});
		
	};
	$scope.cariSub = function(){
		angular.forEach($scope.list_root_subkategori, function(value, key){
			if( value.kode == $scope.kode_sk){
				$scope.data.subkategori = value.kode;
				$scope.data.kode = $scope.data.kode.split("-")[1];
				return;
			};
		});
	};

	$scope.onChangeKategori = function(){
		$http.get('http://localhost:8000/api/kategori/?root=' + $scope.data.kategori).then(function(data){
			$scope.list_root_subkategori = data.data;
			$scope.cariSub();
		});
	};
	$scope.onSave = function(){
		// code
		if( (angular.isDefined($scope.data.kode) && angular.isDefined($scope.data.nama) ) && ( $scope.data.kode !== "" && $scope.data.nama !== "") ){
			if( angular.isDefined($scope.data.tipe) && $scope.data.tipe == true ){
				if( angular.isDefined($scope.data.subkategori ) && $scope.data.subkategori !== ""){
					$scope.data.parent = "/api/kategori/" + $scope.data.subkategori + "/";
				}else{
					$scope.data.parent = "/api/kategori/" + $scope.data.kategori + "/";
				};
				$http.post('/api/kategori/', $scope.data).then(function(data){
					alert(data.data.kode + " berhasil disimpan.");
				}, function(data){
					alert("Data tidak berhasil disimpan.");
				});
			}else{
				$scope.data.kode = $scope.data.subkategori + "-" + $scope.data.kode;
				$scope.data.kategori = "/api/kategori/" + $scope.data.subkategori + "/";
				$http.put($scope.data.url, $scope.data).then(function(data){
					alert(data.data.kode + " berhasil disimpan.");
				}, function(data){
					alert("Data tidak berhasil disimpan.");
				});
			};
			$scope.load();
		};
	};
	$scope.load();
});

my_app.controller("editJurnalUmum", function($scope, $http, $routeParams, $rootScope){
	$scope.load = function(){
		$http.get('/api/akun/').then(function(data){
			$scope.list_akun = data.data;
			$rootScope.title = "- " + $routeParams.kode;
			$http.get('/api/umum/' + $routeParams.kode + "/").then(function(data){
				$scope.data = data.data;
			});
			$scope.list_hapus = [];
			// $scope.data = {};
			// $scope.data.transaksi = [];
		});
	};
	$scope.addRow = function(){
		// code
		$scope.data.transaksi.push({});
	};
	$scope.delRow = function(item){
		if(angular.isDefined(item.url)){
			$scope.list_hapus.push( item );
		};
		var index = $scope.data.transaksi.indexOf(item);
		$scope.data.transaksi.splice(index, 1);
	};
	$scope.onRowChange = function(){
		// code
		var debit = 0;
		var credit = 0;
		$scope.is_valid = false;
		if($scope.data.transaksi.length >= 2){
			angular.forEach($scope.data.transaksi, function(value, key){
				if(!angular.isDefined(value.debit)){ value.debit=0;};
				if(!angular.isDefined(value.credit)){ value.credit=0;};
				if(angular.isDefined(value.akun)){
					debit += value.debit;
					credit += value.credit;
				};
			});
			if( (debit == credit) && (debit !== 0 || credit !== 0) ){ $scope.is_valid=true;}else{ $scope.is_valid=false;};
		};
	};
	$scope.onSave = function(){
		$scope.onRowChange();
		if( $scope.is_valid ){
			$scope.onNew();
		};
	};
	$scope.onNew = function(){
		$http.put($scope.data.url, $scope.data).then(function(data){
			// code
			var kode = 'http://localhost:8000/api/jurnal/' + $scope.data.kode + "/";
			angular.forEach($scope.data.transaksi, function(value, key){
				var url = data.data.url.split("umum");
				value.jurnal = url[0] + "jurnal" + url[1];
				if(angular.isDefined(value.akun) && (value.akun !== "")){
					if(angular.isDefined(value.url)){
						$http.put(value.url, value);
					}else{
						$http.post('/api/transaksi/', value);
					};
				};
			});
			angular.forEach($scope.list_hapus, function(value, key){
				$http.delete(value.url);
			});
			$scope.load();
		});
	};
	$scope.load();
});

my_app.controller("jurnalIndex", function($scope, $http, $timeout, $rootScope){
	// code
	$scope.load = function(){
		$rootScope.title = "- Jurnal Umum";
		// code
		$http.get('/api/umum/').then(function(data){
			// code
			$scope.list_umum = data.data;
		});
	};
	$scope.pisah = function(akun){
		var data = akun.split("/");
		var panjang = data.length;
		return data[panjang-2];
	};
	$scope.interfal = function(){
		$timeout(function() {
	     	$scope.load();
	     	console.log("load");
	     	$scope.interfal();
	    }, 60000);
	};
	$scope.load();
});

my_app.controller("coaController", function($scope, $http, $timeout, $rootScope){
	// code
	$scope.load = function(){
		$rootScope.title = "- Daftar Perkiraan";
		$http.get('/api/akun/').then(function(data){
			$scope.list_akun = data.data;
		});
		$http.get('/api/kategori/').then(function(data){
			$scope.list_kategori = data.data;
		});
	};
	$scope.interfal = function(){
		$timeout(function() {
	     	$scope.load();
	     	console.log("load");
	     	$scope.interfal();
	    }, 60000);
	};
	$scope.load();
});

my_app.controller("jurnalController", function($scope, $http, $rootScope){
	$scope.load = function(){
		$rootScope.title = "- Jurnal Umum";
		$http.get('/api/akun/').then(function(data){
			$scope.list_akun = data.data;
			$scope.data = {};
			$scope.data.transaksi = [];
		});
	};
	$scope.addRow = function(){
		// code
		$scope.data.transaksi.push({});
	};
	$scope.delRow = function(item){
		var index = $scope.data.transaksi.indexOf(item);
		$scope.data.transaksi.splice(index, 1);
	};
	$scope.onRowChange = function(){
		// code
		var debit = 0;
		var credit = 0;
		$scope.is_valid = false;
		if($scope.data.transaksi.length >= 2){
			angular.forEach($scope.data.transaksi, function(value, key){
				if(!angular.isDefined(value.debit)){ value.debit=0;};
				if(!angular.isDefined(value.credit)){ value.credit=0;};
				if(angular.isDefined(value.akun)){
					debit += value.debit;
					credit += value.credit;
				};
			});
			if( (debit == credit) && (debit !== 0 || credit !== 0) ){ $scope.is_valid=true;}else{ $scope.is_valid=false;};
		};
	};
	$scope.onSave = function(){
		if( $scope.is_valid ){
			$scope.onNew();
		};
	};
	$scope.onNew = function(){
		$http.post('/api/umum/', $scope.data).then(function(data){
			// code
			var kode = 'http://localhost:8000/api/jurnal/' + $scope.data.kode + "/";
			angular.forEach($scope.data.transaksi, function(value, key){
				var url = data.data.url.split("umum");
				value.jurnal = url[0] + "jurnal" + url[1];
				if(angular.isDefined(value.url)){
					$http.put('/api/transaksi/', value);
				}else{
					$http.post('/api/transaksi/', value);
				};
			});
		});
		$scope.load();
	};
	$scope.load();
});

my_app.controller("neraca", function ($scope, $http, $timeout, $rootScope){
	$scope.load = function(){
		$rootScope.title = "- Dashboard";
		$scope.jumlah_laba_kotor = 0;
		$scope.jumlah_laba_sebelum_pajak = 0;
		$scope.jumlah_saldo_laba = 0;
		$http.get('http://localhost:8000/api/kategori/aset/').then(function(data){
			$scope.aset = data.data;
			$scope.jumlah_aset = 0;
			angular.forEach($scope.aset, function(value, key){
				//code
				$scope.jumlah_aset += value.saldo_akhir;
			});
		});
		$http.get('http://localhost:8000/api/kategori/kewajiban/').then(function(data){
			$scope.kewajiban = data.data;
			$scope.jumlah_kewajiban = 0;
			angular.forEach($scope.kewajiban, function(value, key){
				$scope.jumlah_kewajiban += value.saldo_akhir;
			});
		});
		$http.get('http://localhost:8000/api/kategori/ekuitas/').then(function(data){
			$scope.ekuitas = data.data;
			$scope.jumlah_ekuitas = 0;
			angular.forEach($scope.ekuitas, function(value, key){
				$scope.jumlah_ekuitas += value.saldo_akhir;
			});
		});
		$http.get('http://localhost:8000/api/kategori/pendapatan/').then(function(data){
			$scope.pendapatan = data.data;
			$scope.jumlah_pendapatan = 0;
			angular.forEach($scope.pendapatan, function(value, key){
				$scope.jumlah_pendapatan += value.saldo_akhir;
			});
			$scope.jumlah_saldo_laba += $scope.jumlah_pendapatan;
			$scope.jumlah_laba_kotor += $scope.jumlah_pendapatan;
		});
		$http.get('http://localhost:8000/api/kategori/beban_pokok/').then(function(data){
			$scope.beban_pokok = data.data;
			$scope.jumlah_beban_pokok = 0;
			angular.forEach($scope.beban_pokok, function(value, key){
				$scope.jumlah_beban_pokok += value.saldo_akhir;
			});
			$scope.jumlah_saldo_laba -= $scope.jumlah_beban_pokok;
			$scope.jumlah_laba_kotor -= $scope.jumlah_beban_pokok;
		});
		$http.get('http://localhost:8000/api/kategori/beban_operasional/').then(function(data){
			$scope.beban_operasional = data.data;
			$scope.jumlah_beban_operasional = 0;
			angular.forEach($scope.beban_operasional, function(value, key){
				$scope.jumlah_beban_operasional += value.saldo_akhir;
			});
			$scope.jumlah_laba_sebelum_pajak = $scope.jumlah_saldo_laba - $scope.jumlah_beban_operasional;
			$scope.jumlah_saldo_laba -= $scope.jumlah_beban_operasional;
		});
		$http.get('http://localhost:8000/api/kategori/beban_pajak/').then(function(data){
			$scope.beban_pajak = data.data;
			$scope.jumlah_beban_pajak = 0;
			angular.forEach($scope.beban_pajak, function(value, key){
				$scope.jumlah_beban_pajak += value.saldo_akhir;
			});
			$scope.jumlah_saldo_laba -= $scope.jumlah_beban_pajak;
		});
	};
	$scope.interfal = function(){
		$timeout(function() {
	     	$scope.load();
	     	console.log("load");
	     	$scope.interfal();
	    }, 60000);
	};
	$scope.load();
});

my_app.controller("laporanController", function ($scope, $http, $filter, $timeout, $rootScope){
	$scope.tanggal = new Date();
	$scope.load = function(){
		$rootScope.title = "- Laporan";
		if(angular.isDefined($scope.tanggal)){
			var tanggal = $filter('date')($scope.tanggal, "yyyy-M-d");
		}else{
			var tanggal = $("#tanggal_laporan").val();
		};
		console.log($scope.tanggal);
		console.log(tanggal);
		$scope.jumlah_laba_kotor = 0;
		$scope.jumlah_laba_sebelum_pajak = 0;
		$scope.jumlah_saldo_laba = 0;
		$http.get('http://localhost:8000/api/kategori/aset/?tanggal=' + tanggal).then(function(data){
			$scope.aset = data.data;
			$scope.jumlah_aset = 0;
			angular.forEach($scope.aset, function(value, key){
				//code
				$scope.jumlah_aset += value.saldo_akhir;
			});
		});
		$http.get('http://localhost:8000/api/kategori/kewajiban/?tanggal=' + tanggal).then(function(data){
			$scope.kewajiban = data.data;
			$scope.jumlah_kewajiban = 0;
			angular.forEach($scope.kewajiban, function(value, key){
				$scope.jumlah_kewajiban += value.saldo_akhir;
			});
		});
		$http.get('http://localhost:8000/api/kategori/ekuitas/?tanggal=' + tanggal).then(function(data){
			$scope.ekuitas = data.data;
			$scope.jumlah_ekuitas = 0;
			angular.forEach($scope.ekuitas, function(value, key){
				$scope.jumlah_ekuitas += value.saldo_akhir;
			});
		});
		$http.get('http://localhost:8000/api/kategori/pendapatan/?tanggal=' + tanggal).then(function(data){
			$scope.pendapatan = data.data;
			$scope.jumlah_pendapatan = 0;
			angular.forEach($scope.pendapatan, function(value, key){
				$scope.jumlah_pendapatan += value.saldo_akhir;
			});
			$scope.jumlah_saldo_laba += $scope.jumlah_pendapatan;
			$scope.jumlah_laba_kotor += $scope.jumlah_pendapatan;
		});
		$http.get('http://localhost:8000/api/kategori/beban_pokok/?tanggal=' + tanggal).then(function(data){
			$scope.beban_pokok = data.data;
			$scope.jumlah_beban_pokok = 0;
			angular.forEach($scope.beban_pokok, function(value, key){
				$scope.jumlah_beban_pokok += value.saldo_akhir;
			});
			$scope.jumlah_saldo_laba -= $scope.jumlah_beban_pokok;
			$scope.jumlah_laba_kotor -= $scope.jumlah_beban_pokok;
		});
		$http.get('http://localhost:8000/api/kategori/beban_operasional/?tanggal=' + tanggal).then(function(data){
			$scope.beban_operasional = data.data;
			$scope.jumlah_beban_operasional = 0;
			angular.forEach($scope.beban_operasional, function(value, key){
				$scope.jumlah_beban_operasional += value.saldo_akhir;
			});
			$scope.jumlah_laba_sebelum_pajak = $scope.jumlah_saldo_laba - $scope.jumlah_beban_operasional;
			$scope.jumlah_saldo_laba -= $scope.jumlah_beban_operasional;
		});
		$http.get('http://localhost:8000/api/kategori/beban_pajak/?tanggal=' + tanggal).then(function(data){
			$scope.beban_pajak = data.data;
			$scope.jumlah_beban_pajak = 0;
			angular.forEach($scope.beban_pajak, function(value, key){
				$scope.jumlah_beban_pajak += value.saldo_akhir;
			});
			$scope.jumlah_saldo_laba -= $scope.jumlah_beban_pajak;
		});

	};
	$scope.interfal = function(){
		$timeout(function() {
	     	$scope.load();
	     	console.log("load");
	     	$scope.interfal();
	    }, 60000);
	};
	$scope.load();
});

my_app.controller("akunController", function($scope, $http, $rootScope){
	$scope.load = function(){
		$http.get('http://localhost:8000/api/kategori/root/').then(function(data){
			$scope.list_root_kategori = data.data;
		});
		$rootScope.title = "- Akun";
		$scope.data = {};
	};
	$scope.onChangeKategori = function(){
		$http.get('http://localhost:8000/api/kategori/?root=' + $scope.data.kategori).then(function(data){
			$scope.list_root_subkategori = data.data;
		});
	};
	$scope.onSave = function(){
		// code
		if( (angular.isDefined($scope.data.kode) && angular.isDefined($scope.data.nama) ) && ( $scope.data.kode !== "" && $scope.data.nama !== "") ){
			if( angular.isDefined($scope.data.tipe) && $scope.data.tipe == true ){
				if( angular.isDefined($scope.data.subkategori ) && $scope.data.subkategori !== ""){
					$scope.data.parent = "/api/kategori/" + $scope.data.subkategori + "/";
				}else{
					$scope.data.parent = "/api/kategori/" + $scope.data.kategori + "/";
				};
				$http.post('/api/kategori/', $scope.data).then(function(data){
					$scope.load();
					alert(data.data.kode + " berhasil disimpan.");
				}, function(data){
					alert("Data tidak berhasil disimpan.");
				});
			}else{
				$scope.data.kode = $scope.data.subkategori + "-" + $scope.data.kode;
				$scope.data.kategori = "/api/kategori/" + $scope.data.subkategori + "/";
				$http.post('/api/akun/', $scope.data).then(function(data){
					$scope.load();
					alert(data.data.kode + " berhasil disimpan.");
				}, function(data){
					alert("Data tidak berhasil disimpan.");
				});
			};
		};
	};
	$scope.load();
});