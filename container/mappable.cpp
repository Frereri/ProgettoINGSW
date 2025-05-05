#include "mappable.hpp" // forse va tolto 
namespace lasd {

//PreOrderMappableContainer    
/* ************************************************************************** */
template <typename Data>
void PreOrderMappableContainer<Data>::Map(MapFun func) {
    PreOrderMap(func);
}
/* ************************************************************************** */


//PostOrderMappableContainer    
/* ************************************************************************** */
template <typename Data>
void PostOrderMappableContainer<Data>::Map(MapFun func){
    PostOrderMap(func);
}

/* ************************************************************************** */
}
