function (doc) {
  // TODO customize this function for your dataset
  if (doc.type === 'vote') {
    emit(doc.item_id, doc.score);
  }
}