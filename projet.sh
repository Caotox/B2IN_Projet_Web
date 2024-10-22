#!/bin/bash

fichier="Names.txt"
var_indice=0
declare -a tableau_indi

while read line; do
    tableau_indi[$var_indice]="$line"
    var_indice=$((var_indice + 1))
done < "$fichier"

longueur_tab=$((${#tableau_indi[@]} / 4))

for (( n=0; n<longueur_tab; n++ )); do  
    
    user=${tableau_indi[0+$ecart_tabl]}
    group=${tableau_indi[1+$ecart_tabl]}
    shell=${tableau_indi[2+$ecart_tabl]}
    rep=${tableau_indi[3+$ecart_tabl]}
    
    if [ ! getent group "$group" > /dev/null ]; then  
        groupadd "$group"
    fi

    if [ getent passwd "$user" > /dev/null ]; then  
        usermod -d "$rep" -s "$shell" -aG "$group" "$user"
    else
        useradd -m -d "$rep" -s "$shell" -G "$group" "$user" 
    fi
    
    PASSWORD=$(openssl rand -base64 12)
    echo "$user:$PASSWORD" | chpasswd
    chage -M 30 "$user"
    echo "Utilisateur : $user, Mot de passe : $PASSWORD"
    ecart_tabl=$(($ecart_tabl + 4)) 
done
