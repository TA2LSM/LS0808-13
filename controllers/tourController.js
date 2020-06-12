const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    //.find() metodu promise döner
    const tours = await Tour.find();

    res.status(200).json({
      status: 'success', //success, fail, error
      results: tours.length, //json standardında bu alan genelde olmaz ama client tarafında işe yarayabilir diye yollanıyor
      data: {
        //tours: tours, //ES6'de aynı isimlileri yazmaya gerek yok ama standart olarak yazılabilir.
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id); //buradaki "id" tourRoutes içindeki .route('/:id') kısmından geliyor
    // Tour.findOne({ _id: req.params.id })

    res.status(200).json({
      status: 'success', //success, fail, error
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

//create a new tour (client to server)
exports.createTour = async (req, res) => {
  try {
    //-----------------------
    // aşağıdaki iki ayrı kısım sonuçta aynı işi yapıyor aslında ama tamamen farklı şekillerde...

    // save methodu direkt yeni Tour dokümanı üzerine uygulanıyor.
    // const newTour = new Tour({...});
    // newTour.save();

    // create methodu direkt Tour modeli üzerine uygulanıyor. (promise döner) then() kullanmamak
    // için createTour fonksiyonunu yukarıda async yaptık.
    //Tour.create({}).then();
    const newTour = await Tour.create(req.body); // bu promise "rejected" olursa catch kısmına atlanır !!!
    //-----------------------

    // 200 kodu "ok", 201 kodu "created", 404 "not found" demek
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    // catch her zaman err objesine erişir. Hata yakalama bloğudur.
    res.status(400).json({
      //400: bad request
      status: 'fail',
      //message: err,
      message: 'Invalid data sent!', //bu tip bir mesaj, gerçek bir uygulama için önerilmez !!!
    });
  }

  /** aşağıdaki gibi "post" request'i çekilirse gelen cevapta "difficulty" ve "rating" olmayacak.
   *  nedeni ise şemada bu alanların olmaması. Bu alanlar "ignore" edilir yani dikkate alınmaz.
  {
    "name": "Test Tour 2",
    "duration": 5,
    "difficulty": "easy",
    "price": 100,
    "rating": 4.7
  }
  */
};

// Update Tour
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the modified document,
      runValidators: true, // Örn: sayı yerine metin girilmeye çalışılırsa hata verdirir. Şemada tip olarak ne dediysek o olsun diye.
    });

    res.status(200).json({
      status: 'success',
      data: {
        //tour: tour,
        // "tour" property is set to "tour" object. In ES6 this will be no more needed if names are same. like below.
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// Delete Tour. REST API'de delete için client'e cevap dönülmemesi önerilir.
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    // 204 kodu "no content" demek. Standart gibi bir şey
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

//exports. şeklinde yazılan fonksiyonlar dosya dışına erişime açılmış demektir.
