#include "dictionary.hpp" // Forse va tolto
#include <stdexcept> // 90 %sciuro che va tolto 

namespace lasd {

//DictionaryContainer
/* ************************************************************************** */

template <typename Data>
bool DictionaryContainer <Data>::InsertAll(const TraversableContainer<Data> &app){
    bool result = true;
    app.Traverse([this,&result](const Data &currentData){
            if (this->Insert(currentData)){
                result = false;
            }
        }
    );
    return result;
}

template <typename Data>
bool DictionaryContainer <Data>::InsertAll(MappableContainer<Data> &&app){
    bool result = true;
    app.Traverse([this, &result](Data &currentData){
            if(this->Insert(std::move(currentData))){
                result=false;
            }
        }
    );
    return result;
}

template <typename Data>
bool DictionaryContainer <Data>::RemoveAll(const TraversableContainer<Data> &app){
    bool result = true;
    app.Traverse([this, &result](const Data & currentData){
            if(this->Remove(currentData)){
                result = false;
            }
        }
    );
    return result;
}

template <typename Data>
bool DictionaryContainer <Data>::InsertSome(const TraversableContainer<Data> &app){
    bool result = false;
    app.Traverse([this, &result](const Data & currentData){
        if (this->Insert(currentData)) {
            result = true;
        }
        }
    );
    return result;
}


template <typename Data>
bool DictionaryContainer <Data>::InsertSome( MappableContainer<Data> &&app){
    bool result = false;
    app.Traverse ([this, &result](Data &currentData){
        if (this->Insert(std::move(currentData))){
            result= true;
        }
    }   
    );
    return result;
}


template <typename Data>
bool DictionaryContainer <Data>::RemoveSome(const TraversableContainer<Data> &app){
    bool result =false;
    app.Traverse([this, &result](const Data &currentData){
        if(this->Remove(currentData)){
            result= true;
        }
    }
);
}
/* ************************************************************************** */

//OrderedDictionaryContainer
/* ************************************************************************** */

//Min
template <typename Data>
const Data & OrderedDictionaryContainer<Data>::Min()const{
    if (size == 0){
        throw std::length_error("Empty");
    }
    return (*this)[0];
}




/* ************************************************************************** */

}
