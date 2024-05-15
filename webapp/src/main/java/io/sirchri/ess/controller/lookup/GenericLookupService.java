/*
 * Copyright (c) 2024 Christian Londero
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package io.sirchri.ess.controller.lookup;

import io.sirchri.ess.model.lookup.GenericLookupEntity;
import io.sirchri.ess.repository.lookup.GenericLookupRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public abstract class GenericLookupService<T extends GenericLookupEntity<T>> {

    private final GenericLookupRepository<T> repository;

    public GenericLookupService(GenericLookupRepository<T> repository) {
        this.repository = repository;
    }

    public List<T> getList()  {        
        return repository.findAll();
    }

    public List<T> getListByIds(List<String> ids)  {
        return repository.findAllById(ids);
    }

    public T get(String id){
        return repository.findById(id).orElseThrow(
                () -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "entity not found"
                  )
        );
    }
}