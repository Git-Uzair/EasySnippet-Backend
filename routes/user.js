'use strict'

const { Router } = require('express')
const { SnippetController } = require('../controllers/SnippetController')

let router = new Router()

/* GET Snippets listing. */
router.get('/snippets', SnippetController.getAllSnippets);
router.post('/snippet', SnippetController.addSnippet);
router.get('/snippet/:id', SnippetController.getSnippet);
router.delete('/snippet/:id', SnippetController.deleteSnippet);
router.put('/snippet/:id', SnippetController.updateSnippet);


module.exports = router