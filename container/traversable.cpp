#include "traversable.hpp" // Probabbilmenta va tolto 
namespace lasd {

// TraversableContainer
/* ************************************************************************** */

template <typename Data, typename Accumulator>
using FoldFun = typename TraversableContainer<Data>:: template FoldFun<Accumulator>;

template <typename Data>
template <typename Accumulator>
Accumulator TraversableContainer<Data>::Fold(FoldFun<Accumulator> func, Accumulator base) const {
  Traverse(
    [func, &base](const Data & currentData) {
      base = func(currentData, base);
    }
  );
  return base;
}

//Override

template <typename Data>
bool TraversableContainer<Data>::Exists(const Data &data)const noexcept{
  bool exists = false;
  Traverse(
      [data, &exists](const Data &currentData){
          if(currentData == data){
            exists = true;
          }
      }
  );
  return exists;
}

/* ************************************************************************** */



//PreOrderTraversableContainer
/* ************************************************************************** */
template <typename Data>
template <typename Accumulator>
Accumulator PreOrderTraversableContainer<Data>::PreOrderFold(FoldFun<Accumulator> func, Accumulator base)const {
  PreOrderTraverse(
    [func, &base](const Data &currentData){
      base = func(currentData, base)
    }
  );
  return base;
}


//Override
template <typename Data>
void PreOrderTraversableContainer<Data>::Traverse(TraverseFun func)const{
  PreOrderFold(func);
}
/* ************************************************************************** */


//PostOrderTraversableContainer
/* ************************************************************************** */
template <typename Data>
template <typename Accumulator>
Accumulator PostOrderTraversableContainer<Data>::PostOrderFold(FoldFun<Accumulator> func, Accumulator base)const{
  PostOrderTraverse(
  [func, &base](const Data &currentData){
      base = func(currentData, base)
    }
  );
  return base;
}


//Override
template <typename Data>
void PostOrderTraversableContainer<Data>::Traverse(TraverseFun func)const{
  PostOrderFold(func);
}

/* ************************************************************************** */
}
