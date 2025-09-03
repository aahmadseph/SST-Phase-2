function trigger(){
  var context = getContext();
  var request = context.getRequest();
  var document = request.getBody();
  var container = context.getCollection();

  var filterQuery =
    {
        'query' : 'SELECT * FROM root r WHERE r.id = @id',
        'parameters' : [
            {'name':'@id', 'value':document.id}
        ]
    };

  var accept = container.queryDocuments(container.getSelfLink(), filterQuery, getInventoryCallback);

  if (!accept) throw "Inventory item has newer modifyts parameter set.";
}

function getInventoryCallback(err, items, responseOptions) {
  var requestModifyts = getContext().getRequest().getBody().modifyts;
  if(err) throw new Error("Error" + err.message);
  if(items.length == 0) return true;
  if(items.length == 1 && items[0].modifyts >= requestModifyts) {
    throw "Inventory item has newer modifyts parameter set: current=" + items[0].modifyts + ", input=" + requestModifyts;
  }
  return;
}
