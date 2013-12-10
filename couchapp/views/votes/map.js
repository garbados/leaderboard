function (doc) {
  if (doc.type === 'vote') {
    emit(doc.item_id, doc.score);
  }
}