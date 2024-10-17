const express = require("express")

const app = express();
const cors = require("cors")

const corOptions = {
    origin: "*",
    credentials: true,
}

app.use(cors(corOptions))

const { initializeDatabase } = require("./db/db.connect")
const Book = require("./models/book.models")


app.use(express.json())

initializeDatabase();

async function createBook(newBook){
    try{
       const book = new Book(newBook)
       const saveBook = await book.save()
       return saveBook
    }catch(error){
       throw error
    }
}

async function readAllBooks(){
    try{
       const allBooks = await Book.find()
       return allBooks
    }catch(error){
        throw error
    }
}

app.post("/books", async(req, res)=>{
    try{
        const savedBook = await  createBook(req.body)
        console.log(savedBook)
        if(savedBook){
            res.status(200).json({message: 'Book added successfully!', book:savedBook})
        }else{
            res.status(404).json({error: 'Book not found'})
        }
    }catch(error){
        console.error(error); 
        res.status(500).json({error: "failed to add book"})
    }
})

app.get("/books", async(req, res)=>{
    try{
      const books = await readAllBooks()
      if(books){
        res.json(books)
      }else{
        res.status(404).json({error: 'Book Not found'})
      }
    }catch(error){
        res.status(500).json("failed to fetch books")
    }
})

async function readBookTitle(bookTitle){
    try{
       const book = await Book.findOne({title:bookTitle})
       return book
    }catch(error){
       throw error
    }   
}

app.get("/books/:bookTitle", async(req, res)=>{
    try{
      const books = await readBookTitle(req.params.bookTitle)
      if(books){
        res.json(books)
      }else{
        res.status(404).json({error: 'Book Not Found'})
      }
    }catch(error){
        res.status(500).json({error: 'failed to fetch books'})
    }
})

async function readBookAuthor(bookAuthor){
    try{
        const book = await Book.findOne({author: bookAuthor})
        return book
    }catch(error){
        throw error;
    }
}

app.get("/books/author/:bookAuthor", async(req, res)=>{
    try{
        const book = await readBookAuthor(req.params.bookAuthor)
        if(book){
            res.json(book)
        }else{
            res.status(404).json({error: 'Book Not Found'})
        }
    }catch(error){
        res.status(500).json({error: 'failed to fetch books'})
    }
})

async function readBooksGenre(bookGenre){
    try{
      const book = await Book.find({genre: bookGenre})
      return book
    }catch(error){
      throw error
    }
}

app.get("/books/genre/:bookGenre", async(req, res)=>{
    try{
       const books = await readBooksGenre(req.params.bookGenre)
       if(books){
        res.json(books)
       }else{
        res.status(404).json({error: 'Book not found'})
       }   
    }catch(error){
        res.status(500).json({error: 'failed to fetch'})
    }
})

async function readBookYear(bookYear){
    try{
        const book = await Book.find({publishedYear: bookYear})
        return book
    }catch(error){
        throw error
    }
}

app.get('/books/year/:bookYear', async(req, res)=>{
    try{
        const book = await readBookYear(req.params.bookYear)
        if(book){
            res.json(book)
        }else{
            res.status(404).json({error: 'No book Found'})
        }
    }catch(error){
        res.status(500).json({error: 'Book Not found'})
    }
})


async function updateBook(bookId, dataToUpdate){
    console.log("Request received to update book"); 
    try{
       const updatedBook = await Book.findByIdAndUpdate(bookId, dataToUpdate, {new : true})
       return updatedBook
    }catch(error){
       console.log("Error in updating Book")
    }
}

app.post("/books/:bookId", async(req, res)=>{
    try{
        const updatedBook = await updateBook(req.params.bookId, req.body)
        if(updatedBook){
            res.status(200).json({message: 'Book updated successfully', updatedBook: updatedBook})
        }else{
            res.status(404).json({error: 'Book Not found'})
        }

    }catch(error){
        res.status(500).json({error: "failed to update book"})
    }
})

async function updateBookTitle(bookTitle, dataToUpdate){
  try{
     const updateBook = await Book.findOneAndUpdate({title: bookTitle}, dataToUpdate, {new: true})
     return updateBook
  }catch(error){
       console.log('Error in updating book:', error);
       console.log('Error in updating book')
  }
}

app.post("/books/directory/:bookTitle", async(req, res)=>{
    //console.log("Route hit: /books/" + req.params.bookTitle)
    console.log("Request received to update book"); 
    console.log("Book title:", req.params.bookTitle); 
    console.log("Data to update:", req.body); 
   // res.status(200).send("Request received");
    try{
        const updatesBook = await updateBookTitle(req.params.bookTitle, req.body)
        console.log(updatesBook)
        if(updatesBook){
            res.status(200).json({message: 'Book updated successfully', updatesBook: updatesBook})
         }else{
            res.status(404).json({error: 'Book does not exist'})
         }
    }
    catch(error){
        console.error('Error in updating book:', error);
        res.status(500).json({error: 'Error in updating book'})
    
    }
})


async function deleteBook(bookId){
    try{
       const deleteBook = await Book.findByIdAndDelete(bookId)
       return deleteBook
    }catch(error){
       console.log(error)
    }
}

app.delete("/books/:bookId", async(req, res)=>{
    try{
        const deletedBook = await deleteBook(req.params.bookId)
        if(deletedBook){
            res.status(200).json({message: 'Book deleted Successfully'})
        }
        
    }catch(error){
        res.status(500).json({error: 'Book not found'})
    }
})

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`)
})







