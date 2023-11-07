/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package io.sirchri.ess.model;

public interface GenericEntity<T> {

    // update current instance with provided data
    void update(T source);

    Long getId();

    // based on current data create new instance with new id
    T createNewInstance();

}
